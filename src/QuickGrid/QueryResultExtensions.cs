using System;
using System.Linq;
using System.Linq.Expressions;

namespace QuickGrid
{
    public static class QueryResultExtensions
    {
        public static QueryResult<TOut> Project<TIn, TOut>(this QueryResult<TIn> source, Expression<Func<TIn, TOut>> projection)
        {
            //excute the original query
            var results = source.Results.ToList();

            var newQuery = results.AsQueryable().Select(projection);

            return new QueryResult<TOut>
            {
                PageIndex = source.PageIndex,
                PageSize = source.PageSize,
                Total = source.Total,
                FilterHash = source.FilterHash,
                Results = newQuery
            };
        }
    }
}
