using System;
using System.CodeDom;
using System.Collections.Generic;
using System.Linq;
using Xunit;

namespace QuickGrid.Tests
{
    public class QueryFilterParsingTests
    {
        private readonly IQueryable<ListItem> _items;
        private Guid _id;

        public class ListItem
        {
            public string Value { get; set; }
            public DateTime Date { get; set; }
            public int Numeric { get; set; }
            public Guid Id { get; set; }
        }

        public QueryFilterParsingTests()
        {
            _id = Guid.NewGuid();
            _items = new List<ListItem>()
            {
                new ListItem() {Value = "One", Date = DateTime.UtcNow.AddYears(-5), Numeric = 50, Id = _id},
                new ListItem() {Value = "Two", Date = DateTime.UtcNow.AddYears(-4), Numeric = 40, Id = _id},
                new ListItem() {Value = "Three", Date = DateTime.UtcNow.AddYears(-3), Numeric = 30, Id = _id},
                new ListItem() {Value = "Four", Date = DateTime.UtcNow.AddYears(-2), Numeric = 20, Id = _id},
                new ListItem() {Value = "Five", Date = DateTime.UtcNow.AddYears(-1), Numeric = 10, Id = _id},
            }.AsQueryable();
        }

        [Fact]
        public void CanCorrectlyParseGuidParameter()
        {
            var options = new TestOptions
            {
                Filters = new Dictionary<string, string>
                {
                    {"Id", $"={_id:D}"}
                }
            };

            var list = QueryOptions.Filter(_items, options);

            Assert.Contains($"Id == \"{_id:D}\"", list.Expression.ToString());
        }

        [Fact]
        public void CanCorrectlyParseEqualsExpression()
        {
            var options = new TestOptions
            {
                Filters = new Dictionary<string, string>
                {
                    {"Value", "=two"}
                }
            };

            var list = QueryOptions.Filter(_items, options);

            Assert.Contains("Value == \"two\"", list.Expression.ToString());
        }

        [Fact]
        public void CanCorrectlyParseContainsExpression()
        {
            var options = new TestOptions
            {
                Filters = new Dictionary<string, string>
                {
                    {"Value", "%two%"}
                }
            };

            var list = QueryOptions.Filter(_items, options);

            Assert.Contains("Value.Contains(\"two\")", list.Expression.ToString());
        }

        [Fact]
        public void CanCorrectlyParseStartsWithExpression()
        {
            var options = new TestOptions
            {
                Filters = new Dictionary<string, string>
                {
                    {"Value", "two%"}
                }
            };

            var list = QueryOptions.Filter(_items, options);

            Assert.Contains("Value.StartsWith(\"two\")", list.Expression.ToString());
        }

        [Fact]
        public void CanCorrectlyParseEndsWithExpression()
        {
            var options = new TestOptions
            {
                Filters = new Dictionary<string, string>
                {
                    {"Value", "%two"}
                }
            };

            var list = QueryOptions.Filter(_items, options);

            Assert.Contains("Value.EndsWith(\"two\")", list.Expression.ToString());
        }

        [Fact]
        public void CanCorrectlyParseContainsArrayExpression()
        {
            var options = new TestOptions
            {
                Filters = new Dictionary<string, string>
                {
                    {"Value", "(one,two)"}
                }
            };

            var list = QueryOptions.Filter(_items, options);

            Assert.Contains("new [] {\"one\", \"two\"}.Contains(r.Value)", list.Expression.ToString());
        }

        [Fact]
        public void CanCorrectlyParseContainsArrayWithCommaExpression()
        {
            var options = new TestOptions
            {
                Filters = new Dictionary<string, string>
                {
                    {"Value", "('one,','two')"}
                }
            };

            var list = QueryOptions.Filter(_items, options);

            Assert.Contains("new [] {\"one,\", \"two\"}.Contains(r.Value)", list.Expression.ToString());
        }

        [Fact]
        public void CanCorrectlyParseContainsArrayWithNotExpression()
        {
            var options = new TestOptions
            {
                Filters = new Dictionary<string, string>
                {
                    {"Value", "!(one,two)"}
                }
            };

            var list = QueryOptions.Filter(_items, options);

            Assert.Contains("Not(new [] {\"one\", \"two\"}.Contains(r.Value))", list.Expression.ToString());
        }

        [Fact]
        public void CanCorrectlyParseGreaterThanExpression()
        {
            var options = new TestOptions
            {
                Filters = new Dictionary<string, string>
                {
                    {"Numeric", ">20"}
                }
            };

            var list = QueryOptions.Filter(_items, options);
            
            Assert.Contains("r.Numeric > 20", list.Expression.ToString());
        }

        [Fact]
        public void CanCorrectlyParseGreaterThanEqualsExpression()
        {
            var options = new TestOptions
            {
                Filters = new Dictionary<string, string>
                {
                    {"Numeric", ">=20"}
                }
            };

            var list = QueryOptions.Filter(_items, options);

            Assert.Contains("r.Numeric >= 20", list.Expression.ToString());
        }

        [Fact]
        public void CanCorrectlyParseLessThanExpression()
        {
            var options = new TestOptions
            {
                Filters = new Dictionary<string, string>
                {
                    {"Numeric", "<20"}
                }
            };

            var list = QueryOptions.Filter(_items, options);

            Assert.Contains("r.Numeric < 20", list.Expression.ToString());
        }

        [Fact]
        public void CanCorrectlyParseLessThanEqualsExpression()
        {
            var options = new TestOptions
            {
                Filters = new Dictionary<string, string>
                {
                    {"Numeric", "<=20"}
                }
            };

            var list = QueryOptions.Filter(_items, options);

            Assert.Contains("r.Numeric <= 20", list.Expression.ToString());
        }

        [Fact]
        public void CanCorrectlyParseLessThanEqualsWithDateExpression()
        {
            var options = new TestOptions
            {
                Filters = new Dictionary<string, string>
                {
                    {"Date", "<=2020-01-01T12:30:00Z"}
                }
            };

            var list = QueryOptions.Filter(_items, options);
            Assert.Contains("r.Date <= 1/01/2020 11:30:00 PM", list.Expression.ToString());
        }
    }
}