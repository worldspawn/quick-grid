using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Expressions;

namespace QuickGrid
{
    public class QueryOptions
    {
        protected QueryOptions()
        {
            PageIndex = 0;
            PageSize = null;
        }

        protected QueryOptions(int pageSize, string defaultSortBy)
        {
            PageIndex = 0;
            PageSize = pageSize;
            SortBy = defaultSortBy;
        }

        public IDictionary<string, string> Filters { get; set; } = new Dictionary<string, string>();

        public string SortBy { get; set; }
        /// <summary>
        /// Zero based paging index
        /// </summary>
        public int PageIndex { get; set; }
        public int? PageSize { get; set; }
        
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