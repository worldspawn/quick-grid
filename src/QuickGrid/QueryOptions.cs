using System;
using System.Collections;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Expressions;
using System.Text.RegularExpressions;

namespace QuickGrid
{
    public class QueryOptions
    {
        protected QueryOptions()
        {
            PageIndex = 0;
            PageSize = null;
        }

        protected QueryOptions(int pageSize, string defaultSortBy, params string[] allowedFilters)
        {
            PageIndex = 0;
            PageSize = pageSize;
            SortBy = defaultSortBy;
            AllowedFilters = allowedFilters;
        }

        public IDictionary<string, string> Filters { get; set; } = new Dictionary<string, string>();

        public string SortBy { get; set; }
        public string[] AllowedFilters { get; set; }

        /// <summary>
        /// Zero based paging index
        /// </summary>
        public int PageIndex { get; set; }
        public int? PageSize { get; set; }
        public string FilterHash { get; set; }

        private static readonly Regex EqualsEx = new Regex("\\A\\!?\\=(.+)$", RegexOptions.Compiled);
        private static readonly Regex ContainsEx = new Regex("\\A\\!?(?=.*%)(\\%?)([^%]+)(\\%?)$", RegexOptions.Compiled);
        private static readonly Regex ContainsArrayEx = new Regex(@"\A\!?\((((?!\')(?<val>[^\)\'\,]+)(?<!\')\,?\s?)+|(('(?<val>[^\)\']+)')\,?\s?)+)\)$", RegexOptions.Compiled);
        private static readonly Regex GreaterThanEx = new Regex("\\A\\!?\\>(.+)$", RegexOptions.Compiled);
        private static readonly Regex LessThanEx = new Regex("\\A\\!?\\<(.+)$", RegexOptions.Compiled);
        private static readonly Regex GreaterThanEqualEx = new Regex("\\A\\!?\\>\\=(.+)$", RegexOptions.Compiled);
        private static readonly Regex LessThanEqualEx = new Regex("\\A\\!?\\<\\=(.+)$", RegexOptions.Compiled);

        //equals- =Test
        //not anything- !=Test, !%TestT
        //contains- %Test%, (Test,Foo,Bar)
        //startswith- Test%
        //endwiths- %Test
        //greaterthan- >20, >2016-10-5T12:00:00Z
        //lessthan- <20
        //greatthanorequal- >=20
        //lessthanorequal- <=20
        public static IQueryable<T> Filter<T>(IQueryable<T> list, QueryOptions options)
        {
            const string not = "!";
            var param = Expression.Parameter(list.ElementType, "r");

            foreach (var filter in options.Filters)
            {
                if (options.AllowedFilters != null && !options.AllowedFilters.Contains(filter.Key))
                {
                    continue;
                }

                MemberExpression memberExpression = null;
                foreach (var memberPart in filter.Key.Split('.'))
                {
                    memberExpression = Expression.PropertyOrField((Expression)memberExpression ?? param, memberPart);
                }

                var isNot = filter.Value.IndexOf(not, StringComparison.InvariantCultureIgnoreCase) == 0;
                var expression = ResolveFilterExpression(memberExpression, filter.Value);

                if (isNot)
                {
                    expression = Expression.Not(expression);
                }

                var exp = Expression.Lambda(expression, param);
                var resultExpression = Expression.Call(typeof(Queryable), "Where", new[] { typeof(T) }, list.Expression, Expression.Quote(exp));

                list = list.Provider.CreateQuery<T>(resultExpression);
            }

            return list;
        }

        private static object GetValue(Type type, string value)
        {
            if (type.IsEnum)
            {
                return Enum.Parse(type, value);
            }

            return Convert.ChangeType(value, type);
        }

        private static Expression ResolveFilterExpression(MemberExpression expression, string filter)
        {
            var em = EqualsEx.Match(filter);
            if (em.Success)
            {
                return Expression.Equal(expression, Expression.Constant(GetValue(expression.Type, em.Groups[1].Value)));
            }

            var cm = ContainsEx.Match(filter);
            if (cm.Success)
            {
                var contains = cm.Groups[1].Value == "%" && cm.Groups[3].Value == "%";
                var startsWith = cm.Groups[1].Value != "%";
                var endsWith = cm.Groups[3].Value != "%";
                if (contains)
                {
                    return Expression.Call(expression, "Contains", null, Expression.Constant(cm.Groups[2].Value));
                }

                if (startsWith)
                {
                    return Expression.Call(expression, "StartsWith", null, Expression.Constant(cm.Groups[2].Value));
                }

                if (endsWith)
                {
                    return Expression.Call(expression, "EndsWith", null, Expression.Constant(cm.Groups[2].Value));
                }
            }

            var cam = ContainsArrayEx.Match(filter);
            if (cam.Success)
            {
                var captures = new List<Capture>();

                for (var i = 0; i < cam.Groups["val"].Captures.Count; i++)
                {
                    captures.Add(cam.Groups["val"].Captures[i]);
                }

                var array = Expression.NewArrayInit(expression.Type, captures.Select(x => Expression.Constant(GetValue(expression.Type, x.Value))));
                return Expression.Call(typeof(Enumerable), "Contains", new[] { expression.Type }, array, expression);
            }

            var gtem = GreaterThanEqualEx.Match(filter);
            if (gtem.Success)
            {
                return Expression.GreaterThanOrEqual(expression, Expression.Constant(GetValue(expression.Type, gtem.Groups[1].Value)));
            }

            var ltem = LessThanEqualEx.Match(filter);
            if (ltem.Success)
            {
                return Expression.LessThanOrEqual(expression, Expression.Constant(GetValue(expression.Type, ltem.Groups[1].Value)));
            }

            var gtm = GreaterThanEx.Match(filter);
            if (gtm.Success)
            {
                return Expression.GreaterThan(expression, Expression.Constant(GetValue(expression.Type, gtm.Groups[1].Value)));
            }

            var ltm = LessThanEx.Match(filter);
            if (ltm.Success)
            {
                return Expression.LessThan(expression, Expression.Constant(GetValue(expression.Type, ltm.Groups[1].Value)));
            }

            return null;
        }

        public static IQueryable<T> Order<T>(IQueryable<T> list, QueryOptions options)
        {
            if (options.SortBy == null)
            {
                return list;
            }

            var param = Expression.Parameter(list.ElementType, "r");
            var thenMode = false;

            foreach (var member in options.SortBy.Split(','))
            {
                MemberExpression memberExpression = null;
                var chop = member.Split(' ');
                foreach (var memberPart in chop[0].Split('.'))
                {
                    memberExpression = Expression.PropertyOrField((Expression)memberExpression ?? param, memberPart);
                }

                var sortDescending = false;
                if (chop.Length > 1)
                {
                    sortDescending = chop[1].IndexOf("desc", StringComparison.InvariantCultureIgnoreCase) > -1;
                }

                string command;
                if (thenMode)
                {
                    command = sortDescending ? "ThenByDescending" : "ThenBy";
                }
                else
                {
                    command = sortDescending ? "OrderByDescending" : "OrderBy";
                }

                var exp = Expression.Lambda(memberExpression, param);
                var resultExpression = Expression.Call(typeof(Queryable), command, new[] { typeof(T), memberExpression.Type }, list.Expression, Expression.Quote(exp));

                list = list.Provider.CreateQuery<T>(resultExpression);
                thenMode = true;
            }

            return list;
        }
    }
}