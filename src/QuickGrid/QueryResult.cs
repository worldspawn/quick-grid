﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Runtime.Serialization;
using Newtonsoft.Json;

namespace QuickGrid
{
    public class QueryResult<T>
    {
        public QueryResult()
        {
            PageCount = new Lazy<int?>(() =>
            {
                if (Total == null)
                {
                    return null;
                }

                return Total.Value/PageSize + (Total.Value%PageSize > 0 ? 1 : 0) ?? 0;
            });
        }

        /// <summary>
        /// Reading the Total *may* trigger a count query. A matching filterhash will cause the total to not be resolved (you will get null).
        /// </summary>
        [JsonConverter(typeof(LazyConverter<int?>))]
        public Lazy<int?> Total { get; set; }

        /// <summary>
        /// Reading the page size will trigger a read of Total which *may* trigger a count query. A matching filterhash will cause the total to not be resolved.
        /// </summary>
        [JsonConverter(typeof(LazyConverter<int?>))]
        public Lazy<int?> PageCount { get; }

        public int PageIndex { get; set; }

        public int? PageSize { get; set; }

        [JsonIgnore]
        public IQueryable<T> ResultsQuery { get; set; }

        public List<T> Results { get; set; }

        public string FilterHash { get; set; }

        [OnSerializing]
        internal void OnSerializing(StreamingContext context)
        {
            if (Results == null || ResultsQuery == null)
                return;

            //execute the results query
            Results = ResultsQuery.ToList();
        }
    }
}