using System.Text;
using System.Threading.Tasks;

namespace QuickGrid.Tests
{
    public class TestOptions : QueryOptions
    {
        public TestOptions() : base(10, "Value", "Value", "Numeric", "Date")
        {
            
        }
    }
}
