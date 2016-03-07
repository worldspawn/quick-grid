using System;
using System.Collections.Generic;
using System.Linq;
using Xunit;

namespace QuickGrid.Tests
{
    public class QueryFilterParsingTests
    {
        [Fact]
        public void CanCorrectlyParseEqualsExpression()
        {
            var objects = new [] {"one", "two", "three"}.Select(x => new
            {
                Value = x
            }).AsQueryable();

            var options = new TestOptions
            {
                Filters = new Dictionary<string, string>
                {
                    {"Value", "=two"}
                }
            };

            var list = QueryOptions.Filter(objects, options);

            Assert.Contains("Value == \"two\"", list.Expression.ToString());
        }

        [Fact]
        public void CanCorrectlyParseContainsExpression()
        {
            var objects = new[] { "one", "two", "three" }.Select(x => new
            {
                Value = x
            }).AsQueryable();

            var options = new TestOptions
            {
                Filters = new Dictionary<string, string>
                {
                    {"Value", "%two%"}
                }
            };

            var list = QueryOptions.Filter(objects, options);

            Assert.Contains("Value.Contains(\"two\")", list.Expression.ToString());
        }

        [Fact]
        public void CanCorrectlyParseStartsWithExpression()
        {
            var objects = new[] { "one", "two", "three" }.Select(x => new
            {
                Value = x
            }).AsQueryable();

            var options = new TestOptions
            {
                Filters = new Dictionary<string, string>
                {
                    {"Value", "two%"}
                }
            };

            var list = QueryOptions.Filter(objects, options);

            Assert.Contains("Value.StartsWith(\"two\")", list.Expression.ToString());
        }

        [Fact]
        public void CanCorrectlyParseEndsWithExpression()
        {
            var objects = new[] { "one", "two", "three" }.Select(x => new
            {
                Value = x
            }).AsQueryable();

            var options = new TestOptions
            {
                Filters = new Dictionary<string, string>
                {
                    {"Value", "%two"}
                }
            };

            var list = QueryOptions.Filter(objects, options);

            Assert.Contains("Value.EndsWith(\"two\")", list.Expression.ToString());
        }

        [Fact]
        public void CanCorrectlyParseContainsArrayExpression()
        {
            var objects = new[] { "one", "two", "three" }.Select(x => new
            {
                Value = x
            }).AsQueryable();

            var options = new TestOptions
            {
                Filters = new Dictionary<string, string>
                {
                    {"Value", "(one,two)"}
                }
            };

            var list = QueryOptions.Filter(objects, options);

            Assert.Contains("new [] {\"one\", \"two\"}.Contains(r.Value)", list.Expression.ToString());
        }

        [Fact]
        public void CanCorrectlyParseContainsArrayWithCommaExpression()
        {
            var objects = new[] { "one", "two", "three" }.Select(x => new
            {
                Value = x
            }).AsQueryable();

            var options = new TestOptions
            {
                Filters = new Dictionary<string, string>
                {
                    {"Value", "('one,','two')"}
                }
            };

            var list = QueryOptions.Filter(objects, options);

            Assert.Contains("new [] {\"one,\", \"two\"}.Contains(r.Value)", list.Expression.ToString());
        }

        [Fact]
        public void CanCorrectlyParseContainsArrayWithNotExpression()
        {
            var objects = new[] { "one", "two", "three" }.Select(x => new
            {
                Value = x
            }).AsQueryable();

            var options = new TestOptions
            {
                Filters = new Dictionary<string, string>
                {
                    {"Value", "!(one,two)"}
                }
            };

            var list = QueryOptions.Filter(objects, options);

            Assert.Contains("Not(new [] {\"one\", \"two\"}.Contains(r.Value))", list.Expression.ToString());
        }

        [Fact]
        public void CanCorrectlyParseGreaterThanExpression()
        {
            var objects = new[] { 10, 20, 30 }.Select(x => new
            {
                Value = x
            }).AsQueryable();

            var options = new TestOptions
            {
                Filters = new Dictionary<string, string>
                {
                    {"Value", ">20"}
                }
            };

            var list = QueryOptions.Filter(objects, options);
            
            Assert.Contains("r.Value > 20", list.Expression.ToString());
        }

        [Fact]
        public void CanCorrectlyParseGreaterThanEqualsExpression()
        {
            var objects = new[] { 10, 20, 30 }.Select(x => new
            {
                Value = x
            }).AsQueryable();

            var options = new TestOptions
            {
                Filters = new Dictionary<string, string>
                {
                    {"Value", ">=20"}
                }
            };

            var list = QueryOptions.Filter(objects, options);

            Assert.Contains("r.Value >= 20", list.Expression.ToString());
        }

        [Fact]
        public void CanCorrectlyParseLessThanExpression()
        {
            var objects = new[] { 10, 20, 30 }.Select(x => new
            {
                Value = x
            }).AsQueryable();

            var options = new TestOptions
            {
                Filters = new Dictionary<string, string>
                {
                    {"Value", "<20"}
                }
            };

            var list = QueryOptions.Filter(objects, options);

            Assert.Contains("r.Value < 20", list.Expression.ToString());
        }

        [Fact]
        public void CanCorrectlyParseLessThanEqualsExpression()
        {
            var objects = new[] { 10, 20, 30 }.Select(x => new
            {
                Value = x
            }).AsQueryable();

            var options = new TestOptions
            {
                Filters = new Dictionary<string, string>
                {
                    {"Value", "<=20"}
                }
            };

            var list = QueryOptions.Filter(objects, options);

            Assert.Contains("r.Value <= 20", list.Expression.ToString());
        }

        [Fact]
        public void CanCorrectlyParseLessThanEqualsWithDateExpression()
        {
            var now = DateTime.UtcNow;
            var objects = new[] { now }.Select(x => new
            {
                Value = x
            }).AsQueryable();

            var options = new TestOptions
            {
                Filters = new Dictionary<string, string>
                {
                    {"Value", "<=2020-01-01T12:30:00Z"}
                }
            };

            var list = QueryOptions.Filter(objects, options);

            Assert.Contains("r.Value <= 1/01/2020 11:30:00 PM", list.Expression.ToString());
        }
    }
}