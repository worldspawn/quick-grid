using System;
using System.Linq;
using Newtonsoft.Json;

namespace QuickGrid
{
    public class QueryResult<T>
    {
        public QueryResult()
        {
            PageCount = new Lazy<int>(() => Total.Value / PageSize + (Total.Value % PageSize > 0 ? 1 : 0) ?? 0);
        }

        [JsonConverter(typeof(LazyConverter<int>))]
        public Lazy<int> Total { get; set; }
        [JsonConverter(typeof(LazyConverter<int>))]
        public Lazy<int> PageCount { get; }
        public int PageIndex { get; set; }
        public int? PageSize { get; set; }
        public IQueryable<T> Results { get; set; }
    }
}