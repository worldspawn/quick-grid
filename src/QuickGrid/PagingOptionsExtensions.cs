using System;
using System.Linq;
using System.Security.Cryptography;
using System.Text;

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

            var filteredList = QueryOptions.Filter(list, queryOptions);
            var orderedList = QueryOptions.Order(filteredList, queryOptions);

            var filterAsString = String.Join(";", queryOptions.Filters.Select(x => $"{x.Key}:{x.Value}").ToArray());
            var hasher = SHA256.Create();
            var filterHash = Convert.ToBase64String(hasher.ComputeHash(Encoding.UTF8.GetBytes(filterAsString)));
            result.FilterHash = filterHash;

            if (filterHash == queryOptions.FilterHash)
            {
                result.Total = new Lazy<int?>(() => null);
            }
            else
            {
                result.Total = new Lazy<int?>(() => filteredList.Count());
            }

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