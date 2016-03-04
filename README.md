# Quick Grid

docs to come :)

## Install

### Bower

```
bower install ng-quick-grid
```

### Nuget

```
Install-Package QuickGrid
```


## Example

The markup

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
  </div>
</form>

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

The angularjs

``` js
var controller = ['SearchModel', '$scope', '$http',
  function (SearchModel, $scope, alertService, $http) {
    var model = {
      search: new SearchModel('ModifiedUtcDate desc'),
      results: null        
    };

    this.model = model;

    function search (searchModel, paging) {
      var payload = angular.extend({}, searchModel, paging);
      return $http.get('/api/orders', { params: payload })
        .then(function (xhr) {
          model.results = xhr.data.results;
          return xhr.data;
        })
        .catch(function (err) {
          console.error(err);
        });
    }

    model.search.attachToScope($scope, search);
  }];
```

The server side (csharp, webapi)

``` csharp
public class OrderListRequest : QueryOptions
{
    public OrderListRequest()
        : base(20, "ModifiedUtcDate desc")
    {
    }

    public OrderType? Type { get; set; }
    public string CompanyName { get; set; }
    public CompanyType? CompanyType { get; set; }
    public decimal Amount { get; set; }
    public string EmailAddress { get; set; }
    public string Status { get; set; }
}

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
