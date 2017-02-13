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
                PageSize = queryOptions.Paging.PageSize,
                PageIndex = queryOptions.Paging.PageIndex
            };

            var filteredList = QueryOptions.Filter(list, queryOptions);
            var orderedList = QueryOptions.Order(filteredList, queryOptions);

            var filterAsString = String.Join(";", queryOptions.Filters.Select(x => $"{x.Key}:{x.Value}").ToArray());
            var hasher = SHA256.Create();
            var filterHash = Convert.ToBase64String(hasher.ComputeHash(Encoding.UTF8.GetBytes(filterAsString)));
            result.FilterHash = filterHash;

            var submittedFilterHash = queryOptions.Paging.FilterHash;
            submittedFilterHash = submittedFilterHash?.Replace(' ', '+');//base64 decode bug fix

            if (filterHash == submittedFilterHash)
            {
                result.Total = new Lazy<int?>(() => null);
            }
            else
            {
                result.Total = new Lazy<int?>(() => orderedList.Count());
            }

            if (queryOptions.Paging.PageSize.HasValue)
            {
                result.Results =
                    orderedList
                        .Skip(queryOptions.Paging.PageIndex * queryOptions.Paging.PageSize.Value)
                        .Take(queryOptions.Paging.PageSize.Value);
            }
            else
            {
                result.Results = orderedList;
            }

            return result;
        }
    }
}