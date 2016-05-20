# Quick Grid

## Installation

### Bower
To add support to your angular application install the bower package
```
bower install ng-quick-grid
```
You should add the `ngQuickGrid` and `quick-grid-partials` modules to your application.

### Nuget
To add support to your .Net application install the nuget package.
```
Install-Package QuickGrid
```

## Filters

### Defining a filter

You define a filter on the model, typically in the controller hosting the grid.

``` javascript
model.search.addFilter('Company.Name', '%');
```

That will add a filter targeting the Company.Name member expression. The `%` symbol indicates that this is a contains/like query. So if the value of the filter is `Acme` a linq expression will be applied as you had typed `queryable.Where(x => x.Company.Name.Contains("Acme"))`.

### Using a filter in your html

There is nothing fancy about using a filter in your markup. Just have the ng-model target the filter's value field.

``` html
<div class="col-lg-4">
  <div class="form-group">
    <label class="control-label">Company Name</label>
    <input type="text" maxlength="200" name="companyName" ng-model="ctrl.model.search.filters['Company.Name'].value" class="form-control" autocomplete="off" />
  </div>
</div>
```

Remember the grid will react immediately to any change to the filter model. You can control that to some extent by using `ng-model-options`.

### Supported Filter Types

|Operator|Name|Description|
|---|---|---|
|%|Contains|Matches any value that contains the filter value.|
|~%|Stars With|Matches any value that starts with the filter value.|
|%~|Ends With|Matches any value that ends with the filter value.|
|()|Equals One Of|Matches any value that exactly matches one the values in a set. This creates an expression like: `query.Where(x => new [] {"Cat", "Dog"}.Contains(x.AnimalType))`. Best used with a multipicker such a `select multiple="multiple"` element.|
|=|Equals|Matches any value that exactly matches the filter value.|
|>|Greater Than|Matches any value that is greater than the filter value. Works with dates and numbers.|
|>=|Greater Than or Equal|Matches any value that is greater or equal to the filter value. Works with dates and numbers.|
|<|Less Than|Matches any value that is less than the filter value. Works with dates and numbers.|
|<=|Less Than or Equal|Matches any value that is less or equal to the filter value. Works with dates and numbers.|

#### Not

You can return the inverse of the filter by calling `setNot(true|false)` on the filter. Or `toggleNot`. Eg: `model.search.filters['Company.Name'].setNot(true)`

## Examples

Adding markup for use in your angular application. Quick grid automatically re queries whenever the model or filters are changed and sets the page index back to zero. The _model_ is an arbitrary object; its members are sent to the server as part of the query request. Filters are structured query parameters that are automatically applied to the query and they are explained in more detail below.

``` html
<form name="form" novalidate>
  <div class="row">
    <div class="col-lg-4">
      <div class="form-group">
        <label class="control-label">Order Type</label>
        <select ng-model="ctrl.model.search.model.type" name="orderType" class="form-control">
          <option value="">--</option>
          <option value="Internal">Internal</option>
          <option value="External">External</option>
        </select>
      </div>
    </div>
    <div class="col-lg-4">
        <div class="form-group">
          <label class="control-label">Company Name</label>
          <input type="text" maxlength="200" name="companyName" ng-model="ctrl.model.search.filters['Company.Name'].value" class="form-control" autocomplete="off" />
        </div>
      </div>
  </div>
</form>
```

This is an example table running on quick grid. Quick grid will handle sort clicks and re query the source while maintaining the current page index. The value of `quick-sort` just needs to be a valid member expression for the target class. Valid members are only those included in the projection and not the source object.

``` html
<table class="table table-hover" quick-grid data-grid-model="ctrl.model.search">
  <thead>
    <tr>
      <th class="col-lg-2" quick-sort="Type">Order Type</th>
      <th class="col-lg-2" quick-sort="Company.Name">Company</th>
      <th class="col-lg-3" quick-sort="Company.Type">Type</th>
      <th class="col-lg-1" quick-sort="Amount">Amount</th>
      <th class="col-lg-2" quick-sort="EmailAddress">Email Address</th>
      <th class="col-lg-2" quick-sort="Status">Status</th>
    </tr>
  </thead>
  <tbody>
    <tr ng-repeat="order in ctrl.model.results">
      <td>{{::order.type}}</td>
      <td>{{::order.company.name}}</td>
      <td>{{::order.company.type)}}</td>
      <td>{{::order.amount}}</td>
      <td>{{::order.emailAddress}}</td>
      <td>{{::order.status}}</td>
    </tr>
  </tbody>
  <tfoot>
    <tr>
      <td colspan="6" class="text-center" quick-paging></td>
    </tr>
  </tfoot>
</table>
```

AngularJS example. This is an example controller that demonstrates creating a search model and binding it (`watch(scope)`) to the search model so it re queries when a change is made. You can instead of using watches, manually refresh the results to page 1 by calling `apply(true)` to execute the search query and return the paging to page 1 (sorting is not changed) or call `apply(false)` to execute the search query without changing the paging.

``` js
var controller = ['SearchModel', '$scope', '$http',
  function (SearchModel, $scope, $http) {
    var model = {
      search: new SearchModel(search, 'Status desc'),
      results: null        
    };

    this.model = model;

    function search (searchModel) {
      return $http.get('/api/orders?' + searchModel.toQueryString(),)
        .then(function (xhr) {
          model.results = xhr.data.results;
          return xhr.data;
        })
        .catch(console.error);
    }

    model.watch($scope);
  }];
```

The server side (csharp, webapi). This shows an example QueryOptions implementation. This example does not make use of filters, instead the properties are deserialized from the model sent from the client. How these are used is up the programmer, they have to manually apply them to the query.

``` csharp
public class OrderListRequest : QueryOptions
{
    public OrderListRequest()
        : base(20, "Status desc")
    {
    }

    public OrderType? Type { get; set; }    
}
```

This is an example route that shows how to make use of a request.

``` csharp
[Route]
public IHttpActionResult Get([FromUri] OrderListRequest request)
{
    var source = _dbContext.Orders.AsQueryable();

    if (request.Type.HasValue)
    {
        source = source.Where(x => x.Type == request.Type);
    }

    var query = source        
        .Select(order => new
        {
            order.Id,
            order.Type,
            Company = new
            {
                order.Company.Name,
                order.Company.Type
            },
            order.Amount
            order.EmailAddress,
            Status = order.Status.Name,
            order.ModifiedUtcDate,            
        });

    var result = request.Apply(query);
    return Ok(result);
}
```

Values stored on your javascript search model (`search.model`) are moved up when transformed into json. There is `model` field in the json.

See you do not have to implement the `Company.Name` filter except to ensure that it can be resolved in the final select expression of your query.
