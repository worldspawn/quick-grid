param (
    [string]$version,
    [string]$apiKey,
    [switch]$push = $false
)

if (!(Test-Path ".\pack"))
{
  mkdir pack
}

$nuget = $ExecutionContext.SessionState.Path.GetUnresolvedProviderPathFromPSPath(".\pack\nuget.exe")

if (!(Test-Path "$nuget")){
  $webclient = New-Object System.Net.WebClient
  $webclient.DownloadFile("https://dist.nuget.org/win-x86-commandline/latest/nuget.exe", $nuget)
}

$assemblyInfos = gci -r AssemblyInfo.cs

foreach ($info in $assemblyInfos) {
  $content = get-content $info;
  $content = $content -replace '\[assembly\: AssemblyVersion\(\"([\d\.]+)\"\)\]', "[assembly: AssemblyVersion(`"$version`")]"
  $content = $content -replace '\[assembly\: AssemblyFileVersion\(\"([\d\.]+)\"\)\]', "[assembly: AssemblyFileVersion(`"$version`")]"

  set-content -Path $info -Encoding UTF8 -Value $content
}

& $nuget pack .\QuickGrid\QuickGrid.csproj -build -properties "configuration=Release;TargetFrameworkVersion=v4.5" -msbuildversion 14 -IncludeReferencedProjects  -output .\pack -version $version


if ($push) {
  & $nuget push ".\pack\QuickGrid.$version.nupkg" -ApiKey $apiKey
}
