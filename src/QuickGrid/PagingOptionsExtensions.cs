using System;
using System.Linq;

namespace QuickGrid
{
    public static class PagingOptionsExtensions
    {
        public static QueryResult<T> Apply<T>(this QueryOptions queryOptions, IQueryable<T> list)
        {
            var result = new QueryResult<T>
            {
                PageSize = queryOptions.PageSize,
                PageIndex = queryOptions.PageIndex
            };

            var orderedList = QueryOptions.Order(list, queryOptions);
            result.Total = new Lazy<int>(() => orderedList.Count());
            if (queryOptions.PageSize.HasValue)
            {
                result.Results =
                    orderedList
                        .Skip(queryOptions.PageIndex * queryOptions.PageSize.Value)
                        .Take(queryOptions.PageSize.Value);
            }
            else
            {
                result.Results = orderedList;
            }

            return result;
        }
    }
}