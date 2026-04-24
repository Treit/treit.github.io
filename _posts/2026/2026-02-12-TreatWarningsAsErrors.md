---
layout: post
title:  "TreatWarningsAsErrors"
date:   2026-02-12 10:00:00
categories: Programming, .NET
---

# TreatWarningsAsErrors

<style>
  .warnings-wrap { font-family: Segoe UI, system-ui, sans-serif; color: #1a1a1a; background: #f8f8f8; padding: 1rem; border-radius: 6px; margin: 1.5rem 0; overflow-x: auto; border: 1px solid #ddd; }
  .warnings-wrap h2 { font-size: 1.2rem; margin-bottom: .2rem; color: #1a1a1a; }
  .warnings-wrap .meta { color: #555; font-size: .8rem; margin-bottom: .5rem; }
  .warnings-wrap table { width: 100%; border-collapse: collapse; font-size: .75rem; }
  .warnings-wrap th { text-align: left; border-bottom: 2px solid #999; padding: .25rem .4rem; color: #333; background: #eaeaea; }
  .warnings-wrap th:first-child { text-align: right; width: 34px; }
  .warnings-wrap td { padding: .2rem .4rem; border-bottom: 1px solid #ddd; white-space: nowrap; color: #1a1a1a; }
  .warnings-wrap td:first-child { text-align: right; font-variant-numeric: tabular-nums; font-weight: 600; }
  .warnings-wrap .desc { color: #444; font-size: .7rem; }
  .warnings-wrap tbody tr:nth-child(even) { background: #efefef; }
  .warnings-wrap tbody tr:nth-child(odd) { background: #f8f8f8; }
  .warnings-wrap tr:hover { background: #dbeafe; }
  .warnings-wrap tfoot td { border-top: 2px solid #999; border-bottom: none; font-weight: 700; }
  .warnings-wrap .bar { display: inline-block; height: 6px; background: #3b72d6; border-radius: 2px; vertical-align: middle; }
</style>

<div class="warnings-wrap">
<h2>Build Warnings Summary</h2>
<p class="meta">msbuild.log -- 2026-02-12 -- 173 distinct warnings, 14662 total</p>
<table>
  <thead><tr><th>#</th><th>Code</th><th>Description</th><th></th></tr></thead>
  <tbody>
    <tr><td>2308</td><td>CS1591</td><td class="desc">Missing XML comment</td><td><span class="bar" style="width:80px"></span></td></tr>
    <tr><td>2076</td><td>CA1707</td><td class="desc">Remove underscores from names</td><td><span class="bar" style="width:72px"></span></td></tr>
    <tr><td>1658</td><td>CS8618</td><td class="desc">Non-nullable uninitialized</td><td><span class="bar" style="width:57px"></span></td></tr>
    <tr><td>882</td><td>CA2007</td><td class="desc">Call ConfigureAwait</td><td><span class="bar" style="width:31px"></span></td></tr>
    <tr><td>522</td><td>CS8602</td><td class="desc">Possibly null dereference</td><td><span class="bar" style="width:18px"></span></td></tr>
    <tr><td>493</td><td>CS8604</td><td class="desc">Possible null argument</td><td><span class="bar" style="width:17px"></span></td></tr>
    <tr><td>391</td><td>IDE0009</td><td class="desc">Add this qualification</td><td><span class="bar" style="width:14px"></span></td></tr>
    <tr><td>378</td><td>CS8625</td><td class="desc">Null to non-nullable</td><td><span class="bar" style="width:13px"></span></td></tr>
    <tr><td>374</td><td>CA1307</td><td class="desc">Specify StringComparison</td><td><span class="bar" style="width:13px"></span></td></tr>
    <tr><td>342</td><td>CS8600</td><td class="desc">Null to non-nullable type</td><td><span class="bar" style="width:12px"></span></td></tr>
    <tr><td>285</td><td>IDE1006</td><td class="desc">Naming rule violation</td><td><span class="bar" style="width:10px"></span></td></tr>
    <tr><td>285</td><td>CA1062</td><td class="desc">Validate public args</td><td><span class="bar" style="width:10px"></span></td></tr>
    <tr><td>268</td><td>CA2000</td><td class="desc">Dispose objects</td><td><span class="bar" style="width:9px"></span></td></tr>
    <tr><td>222</td><td>NU1701</td><td class="desc">Package compatibility</td><td><span class="bar" style="width:8px"></span></td></tr>
    <tr><td>221</td><td>IDE0028</td><td class="desc">Use collection initializer</td><td><span class="bar" style="width:8px"></span></td></tr>
    <tr><td>182</td><td>CA1305</td><td class="desc">Specify IFormatProvider</td><td><span class="bar" style="width:6px"></span></td></tr>
    <tr><td>182</td><td>IDE0055</td><td class="desc">Fix formatting</td><td><span class="bar" style="width:6px"></span></td></tr>
    <tr><td>172</td><td>NU1603</td><td class="desc">Dependency version mismatch</td><td><span class="bar" style="width:6px"></span></td></tr>
    <tr><td>157</td><td>CA2227</td><td class="desc">Read-only collection props</td><td><span class="bar" style="width:5px"></span></td></tr>
    <tr><td>154</td><td>IDE0058</td><td class="desc">Unused expression value</td><td><span class="bar" style="width:5px"></span></td></tr>
    <tr><td>150</td><td>CA1031</td><td class="desc">Catch specific exceptions</td><td><span class="bar" style="width:5px"></span></td></tr>
    <tr><td>143</td><td>CA1002</td><td class="desc">Do not expose generic lists</td><td><span class="bar" style="width:5px"></span></td></tr>
    <tr><td>143</td><td>CA2201</td><td class="desc">Reserved exception types</td><td><span class="bar" style="width:5px"></span></td></tr>
    <tr><td>118</td><td>CS1573</td><td class="desc">Missing param XML tag</td><td><span class="bar" style="width:4px"></span></td></tr>
    <tr><td>80</td><td>IDE0300</td><td class="desc">Use collection expression</td><td><span class="bar" style="width:3px"></span></td></tr>
    <tr><td>79</td><td>IDE0130</td><td class="desc">Namespace mismatch</td><td><span class="bar" style="width:3px"></span></td></tr>
    <tr><td>77</td><td>CS1570</td><td class="desc">Invalid XML in comment</td><td><span class="bar" style="width:3px"></span></td></tr>
    <tr><td>75</td><td>CS8603</td><td class="desc">Possible null return</td><td><span class="bar" style="width:3px"></span></td></tr>
    <tr><td>71</td><td>IDE0073</td><td class="desc">File header mismatch</td><td><span class="bar" style="width:2px"></span></td></tr>
    <tr><td>68</td><td>CA1829</td><td class="desc">Use Length/Count property</td><td><span class="bar" style="width:2px"></span></td></tr>
    <tr><td>59</td><td>CA1822</td><td class="desc">Mark members as static</td><td><span class="bar" style="width:2px"></span></td></tr>
    <tr><td>58</td><td>IDE0065</td><td class="desc">Using directive placement</td><td><span class="bar" style="width:2px"></span></td></tr>
    <tr><td>56</td><td>CA1861</td><td class="desc">Avoid constant arrays as args</td><td><span class="bar" style="width:2px"></span></td></tr>
    <tr><td>55</td><td>IDE0161</td><td class="desc">Use file-scoped namespace</td><td><span class="bar" style="width:2px"></span></td></tr>
    <tr><td>55</td><td>CS8601</td><td class="desc">Possible null assignment</td><td><span class="bar" style="width:2px"></span></td></tr>
    <tr><td>52</td><td>CA1823</td><td class="desc">Avoid unused private fields</td><td><span class="bar" style="width:2px"></span></td></tr>
    <tr><td>52</td><td>IDE0044</td><td class="desc">Make field readonly</td><td><span class="bar" style="width:2px"></span></td></tr>
    <tr><td>50</td><td>CA1826</td><td class="desc">Use property not Enumerable</td><td><span class="bar" style="width:2px"></span></td></tr>
    <tr><td>48</td><td>CA1860</td><td class="desc">Avoid Enumerable.Any()</td><td><span class="bar" style="width:2px"></span></td></tr>
    <tr><td>47</td><td>IDE0011</td><td class="desc">Add braces</td><td><span class="bar" style="width:2px"></span></td></tr>
    <tr><td>47</td><td>CS0108</td><td class="desc">Hides inherited member</td><td><span class="bar" style="width:2px"></span></td></tr>
    <tr><td>46</td><td>CS0618</td><td class="desc">Obsolete member usage</td><td><span class="bar" style="width:2px"></span></td></tr>
    <tr><td>43</td><td>CA1304</td><td class="desc">Specify CultureInfo</td><td><span class="bar" style="width:1px"></span></td></tr>
    <tr><td>42</td><td>CA1311</td><td class="desc">Specify culture for strings</td><td><span class="bar" style="width:1px"></span></td></tr>
    <tr><td>39</td><td>IDE0059</td><td class="desc">Unnecessary assignment</td><td><span class="bar" style="width:1px"></span></td></tr>
    <tr><td>39</td><td>CA1849</td><td class="desc">Call async in async method</td><td><span class="bar" style="width:1px"></span></td></tr>
    <tr><td>39</td><td>MSB3277</td><td class="desc">Assembly version conflict</td><td><span class="bar" style="width:1px"></span></td></tr>
    <tr><td>38</td><td>CA1508</td><td class="desc">Dead conditional code</td><td><span class="bar" style="width:1px"></span></td></tr>
    <tr><td>38</td><td>IDE0060</td><td class="desc">Remove unused parameter</td><td><span class="bar" style="width:1px"></span></td></tr>
    <tr><td>36</td><td>CA1851</td><td class="desc">Possible multiple enumerations</td><td><span class="bar" style="width:1px"></span></td></tr>
    <tr><td>36</td><td>CS8620</td><td class="desc">Nullability mismatch in arg</td><td><span class="bar" style="width:1px"></span></td></tr>
    <tr><td>33</td><td>CA1725</td><td class="desc">Param names match base</td><td><span class="bar" style="width:1px"></span></td></tr>
    <tr><td>33</td><td>IDE0090</td><td class="desc">Simplify new expression</td><td><span class="bar" style="width:1px"></span></td></tr>
    <tr><td>32</td><td>CA1308</td><td class="desc">Normalize to uppercase</td><td><span class="bar" style="width:1px"></span></td></tr>
    <tr><td>32</td><td>CA1720</td><td class="desc">No type names in identifiers</td><td><span class="bar" style="width:1px"></span></td></tr>
    <tr><td>31</td><td>CA1852</td><td class="desc">Seal internal types</td><td><span class="bar" style="width:1px"></span></td></tr>
    <tr><td>30</td><td>CA1310</td><td class="desc">Specify StringComparison</td><td><span class="bar" style="width:1px"></span></td></tr>
    <tr><td>29</td><td>CS0219</td><td class="desc">Variable assigned not used</td><td><span class="bar" style="width:1px"></span></td></tr>
    <tr><td>28</td><td>IDE0010</td><td class="desc">Add missing switch cases</td><td><span class="bar" style="width:1px"></span></td></tr>
    <tr><td>26</td><td>CA1859</td><td class="desc">Use concrete types</td><td><span class="bar" style="width:1px"></span></td></tr>
    <tr><td>26</td><td>IDE0034</td><td class="desc">Simplify default expression</td><td><span class="bar" style="width:1px"></span></td></tr>
    <tr><td>26</td><td>SYSLIB1045</td><td class="desc">Use GeneratedRegex</td><td><span class="bar" style="width:1px"></span></td></tr>
    <tr><td>24</td><td>CA1825</td><td class="desc">Avoid zero-length arrays</td><td><span class="bar" style="width:1px"></span></td></tr>
    <tr><td>24</td><td>CA2234</td><td class="desc">Pass URIs not strings</td><td><span class="bar" style="width:1px"></span></td></tr>
    <tr><td>23</td><td>CA1724</td><td class="desc">Type name conflicts namespace</td><td><span class="bar" style="width:1px"></span></td></tr>
    <tr><td>23</td><td>CS1998</td><td class="desc">Async lacks await</td><td><span class="bar" style="width:1px"></span></td></tr>
    <tr><td>21</td><td>CA2016</td><td class="desc">Forward CancellationToken</td><td><span class="bar" style="width:1px"></span></td></tr>
    <tr><td>19</td><td>CS1572</td><td class="desc">Param tag no matching param</td><td><span class="bar" style="width:1px"></span></td></tr>
    <tr><td>18</td><td>IDE0057</td><td class="desc">Use range operator</td><td><span class="bar" style="width:1px"></span></td></tr>
    <tr><td>18</td><td>CA1507</td><td class="desc">Use nameof</td><td><span class="bar" style="width:1px"></span></td></tr>
    <tr><td>18</td><td>IDE0071</td><td class="desc">Simplify interpolation</td><td><span class="bar" style="width:1px"></span></td></tr>
    <tr><td>17</td><td>CA1819</td><td class="desc">Properties return arrays</td><td><span class="bar" style="width:1px"></span></td></tr>
    <tr><td>16</td><td>CA1051</td><td class="desc">Visible instance fields</td><td><span class="bar" style="width:1px"></span></td></tr>
    <tr><td>16</td><td>IDE0017</td><td class="desc">Use object initializers</td><td><span class="bar" style="width:1px"></span></td></tr>
    <tr><td>16</td><td>CS0168</td><td class="desc">Variable never used</td><td><span class="bar" style="width:1px"></span></td></tr>
    <tr><td>16</td><td>CA1034</td><td class="desc">Nested types visible</td><td><span class="bar" style="width:1px"></span></td></tr>
    <tr><td>16</td><td>CA1001</td><td class="desc">Types own disposable fields</td><td><span class="bar" style="width:1px"></span></td></tr>
    <tr><td>15</td><td>CA1862</td><td class="desc">Use StringComparison</td><td><span class="bar" style="width:1px"></span></td></tr>
    <tr><td>15</td><td>CA1032</td><td class="desc">Implement exception ctors</td><td><span class="bar" style="width:1px"></span></td></tr>
    <tr><td>15</td><td>IDE0301</td><td class="desc">Use collection expression</td><td><span class="bar" style="width:1px"></span></td></tr>
    <tr><td>15</td><td>CA1063</td><td class="desc">Implement IDisposable</td><td><span class="bar" style="width:1px"></span></td></tr>
    <tr><td>14</td><td>IDE0072</td><td class="desc">Add missing switch cases</td><td><span class="bar" style="width:1px"></span></td></tr>
    <tr><td>14</td><td>CS8629</td><td class="desc">Nullable value may be null</td><td><span class="bar" style="width:1px"></span></td></tr>
    <tr><td>13</td><td>CS8632</td><td class="desc">Nullable annotation context</td><td><span class="bar" style="width:1px"></span></td></tr>
    <tr><td>12</td><td>CS0169</td><td class="desc">Field never used</td><td><span class="bar" style="width:1px"></span></td></tr>
    <tr><td>12</td><td>CA2254</td><td class="desc">Template should be static</td><td><span class="bar" style="width:1px"></span></td></tr>
    <tr><td>12</td><td>CA1303</td><td class="desc">Do not pass literals</td><td><span class="bar" style="width:1px"></span></td></tr>
    <tr><td>12</td><td>IDE0040</td><td class="desc">Add accessibility modifiers</td><td><span class="bar" style="width:1px"></span></td></tr>
    <tr><td>12</td><td>CA1848</td><td class="desc">Use LoggerMessage delegates</td><td><span class="bar" style="width:1px"></span></td></tr>
    <tr><td>11</td><td>CA1816</td><td class="desc">Call GC.SuppressFinalize</td><td><span class="bar" style="width:1px"></span></td></tr>
    <tr><td>11</td><td>CA1068</td><td class="desc">CancellationToken last</td><td><span class="bar" style="width:1px"></span></td></tr>
    <tr><td>11</td><td>CA1805</td><td class="desc">Unnecessary initialization</td><td><span class="bar" style="width:1px"></span></td></tr>
    <tr><td>11</td><td>CA1715</td><td class="desc">Identifier prefix</td><td><span class="bar" style="width:1px"></span></td></tr>
    <tr><td>10</td><td>IDE0305</td><td class="desc">Use collection expression</td><td><span class="bar" style="width:1px"></span></td></tr>
    <tr><td>10</td><td>IDE0120</td><td class="desc">Simplify LINQ</td><td><span class="bar" style="width:1px"></span></td></tr>
    <tr><td>10</td><td>CS8605</td><td class="desc">Unboxing possibly null</td><td><span class="bar" style="width:1px"></span></td></tr>
    <tr><td>10</td><td>CA1869</td><td class="desc">Cache JsonSerializerOptions</td><td><span class="bar" style="width:1px"></span></td></tr>
    <tr><td>9</td><td>CA1024</td><td class="desc">Use properties</td><td><span class="bar" style="width:1px"></span></td></tr>
    <tr><td>9</td><td>CS9113</td><td class="desc">Parameter unread</td><td><span class="bar" style="width:1px"></span></td></tr>
    <tr><td>9</td><td>CA1055</td><td class="desc">URI return not string</td><td><span class="bar" style="width:1px"></span></td></tr>
    <tr><td>9</td><td>CS9124</td><td class="desc">Param in state machine</td><td><span class="bar" style="width:1px"></span></td></tr>
    <tr><td>9</td><td>CA2208</td><td class="desc">Correct ArgumentException</td><td><span class="bar" style="width:1px"></span></td></tr>
    <tr><td>8</td><td>CA1863</td><td class="desc">Use char overload</td><td><span class="bar" style="width:1px"></span></td></tr>
    <tr><td>8</td><td>CA1854</td><td class="desc">Prefer TryGetValue</td><td><span class="bar" style="width:1px"></span></td></tr>
    <tr><td>8</td><td>CA1052</td><td class="desc">Seal static holder types</td><td><span class="bar" style="width:1px"></span></td></tr>
    <tr><td>8</td><td>CS4014</td><td class="desc">Unawaited async call</td><td><span class="bar" style="width:1px"></span></td></tr>
    <tr><td>8</td><td>CS3021</td><td class="desc"></td><td><span class="bar" style="width:1px"></span></td></tr>
    <tr><td>7</td><td>ASP0019</td><td class="desc">Use IHeaderDictionary</td><td><span class="bar" style="width:1px"></span></td></tr>
    <tr><td>7</td><td>CA1827</td><td class="desc">Use Any not Count</td><td><span class="bar" style="width:1px"></span></td></tr>
    <tr><td>7</td><td>IDE0020</td><td class="desc">Pattern matching null check</td><td><span class="bar" style="width:1px"></span></td></tr>
    <tr><td>7</td><td>IDE0019</td><td class="desc">Use pattern matching</td><td><span class="bar" style="width:1px"></span></td></tr>
    <tr><td>7</td><td>CA5399</td><td class="desc">Disable cert check</td><td><span class="bar" style="width:1px"></span></td></tr>
    <tr><td>7</td><td>CA1716</td><td class="desc">Identifier matches keyword</td><td><span class="bar" style="width:1px"></span></td></tr>
    <tr><td>6</td><td>CS9107</td><td class="desc">Param captured and assigned</td><td><span class="bar" style="width:1px"></span></td></tr>
    <tr><td>6</td><td>SYSLIB0026</td><td class="desc">Obsolete MutuallyAuth</td><td><span class="bar" style="width:1px"></span></td></tr>
    <tr><td>6</td><td>CS8767</td><td class="desc">Nullability in param</td><td><span class="bar" style="width:1px"></span></td></tr>
    <tr><td>6</td><td>CA1866</td><td class="desc">Use char overload</td><td><span class="bar" style="width:1px"></span></td></tr>
    <tr><td>5</td><td>CS8765</td><td class="desc">Nullability in override</td><td><span class="bar" style="width:1px"></span></td></tr>
    <tr><td>5</td><td>CS1587</td><td class="desc">Misplaced XML comment</td><td><span class="bar" style="width:1px"></span></td></tr>
    <tr><td>5</td><td>CA1834</td><td class="desc">Use StringBuilder char</td><td><span class="bar" style="width:1px"></span></td></tr>
    <tr><td>5</td><td>CA1309</td><td class="desc">Use ordinal StringComparison</td><td><span class="bar" style="width:1px"></span></td></tr>
    <tr><td>5</td><td>CA1721</td><td class="desc">Property matches get method</td><td><span class="bar" style="width:1px"></span></td></tr>
    <tr><td>4</td><td>CA1054</td><td class="desc">URI param not string</td><td><span class="bar" style="width:1px"></span></td></tr>
    <tr><td>4</td><td>IDE0100</td><td class="desc">Unnecessary equality op</td><td><span class="bar" style="width:1px"></span></td></tr>
    <tr><td>4</td><td>CA1806</td><td class="desc">Do not ignore results</td><td><span class="bar" style="width:1px"></span></td></tr>
    <tr><td>4</td><td>IDE0004</td><td class="desc">Remove unnecessary cast</td><td><span class="bar" style="width:1px"></span></td></tr>
    <tr><td>3</td><td>CA1847</td><td class="desc">Use string.Contains(char)</td><td><span class="bar" style="width:1px"></span></td></tr>
    <tr><td>3</td><td>CA1836</td><td class="desc">Prefer IsEmpty over Count</td><td><span class="bar" style="width:1px"></span></td></tr>
    <tr><td>3</td><td>IDE0031</td><td class="desc">Use null propagation</td><td><span class="bar" style="width:1px"></span></td></tr>
    <tr><td>3</td><td>IDE0027</td><td class="desc">Use expression body</td><td><span class="bar" style="width:1px"></span></td></tr>
    <tr><td>3</td><td>CA1028</td><td class="desc">Enum storage Int32</td><td><span class="bar" style="width:1px"></span></td></tr>
    <tr><td>3</td><td>CA2211</td><td class="desc">Non-constant visible fields</td><td><span class="bar" style="width:1px"></span></td></tr>
    <tr><td>3</td><td>CS8619</td><td class="desc">Nullability mismatch</td><td><span class="bar" style="width:1px"></span></td></tr>
    <tr><td>3</td><td>IDE0220</td><td class="desc">Add explicit cast</td><td><span class="bar" style="width:1px"></span></td></tr>
    <tr><td>3</td><td>CS8714</td><td class="desc">Type param constraint</td><td><span class="bar" style="width:1px"></span></td></tr>
    <tr><td>3</td><td>CS0649</td><td class="desc">Field never assigned</td><td><span class="bar" style="width:1px"></span></td></tr>
    <tr><td>3</td><td>CS8621</td><td class="desc">Nullability in return type</td><td><span class="bar" style="width:1px"></span></td></tr>
    <tr><td>2</td><td>CS0114</td><td class="desc">Hides inherited member</td><td><span class="bar" style="width:1px"></span></td></tr>
    <tr><td>2</td><td>IDE0200</td><td class="desc"></td><td><span class="bar" style="width:1px"></span></td></tr>
    <tr><td>2</td><td>CA1069</td><td class="desc">Duplicate enum values</td><td><span class="bar" style="width:1px"></span></td></tr>
    <tr><td>2</td><td>CA1008</td><td class="desc">Enums have zero value</td><td><span class="bar" style="width:1px"></span></td></tr>
    <tr><td>2</td><td>CA1012</td><td class="desc">Abstract types no ctors</td><td><span class="bar" style="width:1px"></span></td></tr>
    <tr><td>2</td><td>CA1850</td><td class="desc">Prefer static HashData</td><td><span class="bar" style="width:1px"></span></td></tr>
    <tr><td>2</td><td>CA1027</td><td class="desc">Mark enums with Flags</td><td><span class="bar" style="width:1px"></span></td></tr>
    <tr><td>2</td><td>CA5394</td><td class="desc">Insecure randomness</td><td><span class="bar" style="width:1px"></span></td></tr>
    <tr><td>2</td><td>CA1820</td><td class="desc">Test empty using length</td><td><span class="bar" style="width:1px"></span></td></tr>
    <tr><td>2</td><td>CA1812</td><td class="desc"></td><td><span class="bar" style="width:1px"></span></td></tr>
    <tr><td>2</td><td>CA1056</td><td class="desc">URI prop not string</td><td><span class="bar" style="width:1px"></span></td></tr>
    <tr><td>2</td><td>CA2213</td><td class="desc">Dispose disposable fields</td><td><span class="bar" style="width:1px"></span></td></tr>
    <tr><td>2</td><td>CA1711</td><td class="desc">Incorrect identifier suffix</td><td><span class="bar" style="width:1px"></span></td></tr>
    <tr><td>2</td><td>CA1845</td><td class="desc">Use span-based Concat</td><td><span class="bar" style="width:1px"></span></td></tr>
    <tr><td>1</td><td>IDE0210</td><td class="desc"></td><td><span class="bar" style="width:1px"></span></td></tr>
    <tr><td>1</td><td>CA2215</td><td class="desc">Call base Dispose</td><td><span class="bar" style="width:1px"></span></td></tr>
    <tr><td>1</td><td>CS8622</td><td class="desc">Nullability in parameter</td><td><span class="bar" style="width:1px"></span></td></tr>
    <tr><td>1</td><td>ASP0018</td><td class="desc">Unused route parameter</td><td><span class="bar" style="width:1px"></span></td></tr>
    <tr><td>1</td><td>CA1016</td><td class="desc">Mark with AssemblyVersion</td><td><span class="bar" style="width:1px"></span></td></tr>
    <tr><td>1</td><td>CA1033</td><td class="desc">Interface callable by child</td><td><span class="bar" style="width:1px"></span></td></tr>
    <tr><td>1</td><td>CA1040</td><td class="desc">Avoid empty interfaces</td><td><span class="bar" style="width:1px"></span></td></tr>
    <tr><td>1</td><td>CA1065</td><td class="desc">Unexpected exception location</td><td><span class="bar" style="width:1px"></span></td></tr>
    <tr><td>1</td><td>CA1067</td><td class="desc">Override Equals for IEquatable</td><td><span class="bar" style="width:1px"></span></td></tr>
    <tr><td>1</td><td>CA1416</td><td class="desc">Platform compatibility</td><td><span class="bar" style="width:1px"></span></td></tr>
    <tr><td>1</td><td>CA1510</td><td class="desc">Use ThrowIfNull</td><td><span class="bar" style="width:1px"></span></td></tr>
    <tr><td>1</td><td>CA1844</td><td class="desc">Memory-based overrides</td><td><span class="bar" style="width:1px"></span></td></tr>
    <tr><td>1</td><td>CA1846</td><td class="desc">Prefer AsSpan</td><td><span class="bar" style="width:1px"></span></td></tr>
    <tr><td>1</td><td>CA1867</td><td class="desc">Use char overload</td><td><span class="bar" style="width:1px"></span></td></tr>
    <tr><td>1</td><td>CS0162</td><td class="desc">Unreachable code</td><td><span class="bar" style="width:1px"></span></td></tr>
    <tr><td>1</td><td>CS0659</td><td class="desc">Missing GetHashCode</td><td><span class="bar" style="width:1px"></span></td></tr>
    <tr><td>1</td><td>CS1571</td><td class="desc">Duplicate param XML tag</td><td><span class="bar" style="width:1px"></span></td></tr>
    <tr><td>1</td><td>CS1574</td><td class="desc">Unresolved cref</td><td><span class="bar" style="width:1px"></span></td></tr>
    <tr><td>1</td><td>CS8524</td><td class="desc">Missing enum switch cases</td><td><span class="bar" style="width:1px"></span></td></tr>
    <tr><td>1</td><td>CS8613</td><td class="desc">Nullability in return</td><td><span class="bar" style="width:1px"></span></td></tr>
    <tr><td>1</td><td>IDE0056</td><td class="desc">Use index operator</td><td><span class="bar" style="width:1px"></span></td></tr>
    <tr><td>1</td><td>ASP0000</td><td class="desc">Avoid BuildServiceProvider</td><td><span class="bar" style="width:1px"></span></td></tr>
  </tbody>
  <tfoot><tr><td>14662</td><td colspan="3">Total</td></tr></tfoot>
</table>
</div>

To put this in perspective, here is a summary of the codebase in question. This is not a large codebase by any stretch: roughly 145,000 lines of C# spread across about a thousand files. And yet, **14,662 warnings**. That is roughly one warning for every ten lines of code.

```
===============================================================================
 Language            Files        Lines         Code     Comments       Blanks
===============================================================================
 Batch                   2           51           36            2           13
 C#                   1028       193547       144963        24483        24101
 Dockerfile              2           43           22            8           13
 JSON                  525       235599       235461            0          138
 MSBuild                40         1414         1251           36          127
 PowerShell              3          449          317           72           60
 Python                  4         1561         1214          107          240
 Shell                   6         1308          955          121          232
 SQL                     6          318          291            2           25
 Plain Text             55         6030            0         5855          175
 Visual Studio Sol       6          415          409            0            6
 YAML                  148        20180        18969          715          496
-------------------------------------------------------------------------------
 Markdown               12         1822            0         1382          440
 |- BASH                 2           60           34           16           10
 |- JSON                 1           31           31            0            0
 |- PowerShell           1            5            4            1            0
 |- Python               1           25           14            7            4
 |- SQL                  1            5            5            0            0
 (Total)                           1948           88         1406          454
===============================================================================
 Total                1837       462737       403888        32783        26066
===============================================================================
```

