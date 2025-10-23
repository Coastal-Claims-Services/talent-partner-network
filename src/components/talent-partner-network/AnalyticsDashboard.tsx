import React, { useState, useEffect } from 'react';
import {
  BarChart3, TrendingUp, Users, MapPin, Award, Clock, DollarSign,
  Calendar, Activity, AlertCircle, CheckCircle, XCircle, Filter,
  Download, RefreshCw, ChevronDown, ArrowUp, ArrowDown, Minus
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Badge } from '../ui/badge';
import { Progress } from '../ui/progress';
import { Alert, AlertDescription } from '../ui/alert';
import api from '../../services/talent-partner-network/api';

interface MetricCard {
  title: string;
  value: string | number;
  change: number;
  changeType: 'increase' | 'decrease' | 'neutral';
  icon: React.ElementType;
  color: string;
}

const AnalyticsDashboard: React.FC = () => {
  const [timeRange, setTimeRange] = useState('30d');
  const [selectedState, setSelectedState] = useState('all');
  const [isLoading, setIsLoading] = useState(true);
  const [metrics, setMetrics] = useState<any>(null);
  const [stateMetrics, setStateMetrics] = useState<any[]>([]);

  useEffect(() => {
    loadAnalytics();
  }, [timeRange, selectedState]);

  const loadAnalytics = async () => {
    try {
      setIsLoading(true);
      const [networkStats, stateData] = await Promise.all([
        api.getNetworkStats(),
        api.getStateMetrics(selectedState === 'all' ? undefined : selectedState)
      ]);
      
      setMetrics(networkStats);
      setStateMetrics(stateData);
    } catch (error) {
      console.error('Error loading analytics:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleExport = () => {
    // Export functionality would go here
    console.log('Exporting analytics data...');
  };

  const getChangeIndicator = (change: number) => {
    if (change > 0) return <ArrowUp className="h-4 w-4 text-green-500" />;
    if (change < 0) return <ArrowDown className="h-4 w-4 text-red-500" />;
    return <Minus className="h-4 w-4 text-gray-400" />;
  };

  const formatPercentage = (value: number) => {
    return `${value > 0 ? '+' : ''}${value.toFixed(1)}%`;
  };

  // Mock data for demonstration
  const overviewMetrics: MetricCard[] = [
    {
      title: 'Total Adjusters',
      value: metrics?.totalAdjusters || 156,
      change: 12.5,
      changeType: 'increase',
      icon: Users,
      color: 'blue'
    },
    {
      title: 'Total Partners',
      value: metrics?.totalPartners || 84,
      change: 8.3,
      changeType: 'increase',
      icon: Award,
      color: 'purple'
    },
    {
      title: 'Active Deployments',
      value: metrics?.activeDeployments || 42,
      change: -5.2,
      changeType: 'decrease',
      icon: MapPin,
      color: 'green'
    },
    {
      title: 'Avg Response Time',
      value: metrics?.avgResponseTime || '2.5 hrs',
      change: -15.0,
      changeType: 'increase',
      icon: Clock,
      color: 'orange'
    }
  ];

  const performanceData = [
    { name: 'Claims Processed', adjusters: 1250, partners: 890 },
    { name: 'Avg Completion Time', adjusters: 3.2, partners: 4.1 },
    { name: 'Customer Satisfaction', adjusters: 4.6, partners: 4.3 },
    { name: 'Cost Efficiency', adjusters: 92, partners: 87 }
  ];

  const topPerformers = [
    { name: 'John Smith', type: 'Adjuster', rating: 4.9, claims: 127, responseTime: '1.5 hrs' },
    { name: 'RestorePro Services', type: 'Partner', rating: 4.8, claims: 98, responseTime: '2.0 hrs' },
    { name: 'Sarah Johnson', type: 'Adjuster', rating: 4.8, claims: 115, responseTime: '1.8 hrs' },
    { name: 'Quick Response Eng.', type: 'Partner', rating: 4.7, claims: 87, responseTime: '2.2 hrs' },
    { name: 'Mike Davis', type: 'Adjuster', rating: 4.7, claims: 102, responseTime: '2.0 hrs' }
  ];

  const licenseExpirations = [
    { name: 'John Smith', state: 'FL', expires: '2024-02-15', daysLeft: 45 },
    { name: 'Sarah Johnson', state: 'TX', expires: '2024-01-31', daysLeft: 30 },
    { name: 'Mike Davis', state: 'CA', expires: '2024-01-20', daysLeft: 19 },
    { name: 'Emily Brown', state: 'NY', expires: '2024-01-15', daysLeft: 14 },
    { name: 'Robert Wilson', state: 'IL', expires: '2024-01-10', daysLeft: 9 }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Talent Network Analytics</h1>
          <p className="text-gray-500">Monitor performance and network metrics</p>
        </div>
        <div className="flex items-center gap-2">
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="w-[150px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7d">Last 7 days</SelectItem>
              <SelectItem value="30d">Last 30 days</SelectItem>
              <SelectItem value="90d">Last 90 days</SelectItem>
              <SelectItem value="1y">Last year</SelectItem>
            </SelectContent>
          </Select>
          <Button onClick={loadAnalytics} variant="outline" size="icon">
            <RefreshCw className="h-4 w-4" />
          </Button>
          <Button onClick={handleExport} variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      {/* Overview Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {overviewMetrics.map((metric, index) => (
          <Card key={index}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">{metric.title}</p>
                  <p className="text-2xl font-bold mt-1">{metric.value}</p>
                  <div className="flex items-center gap-1 mt-2">
                    {getChangeIndicator(metric.change)}
                    <span className={`text-sm ${
                      metric.change > 0 ? 'text-green-500' : 
                      metric.change < 0 ? 'text-red-500' : 'text-gray-400'
                    }`}>
                      {formatPercentage(metric.change)}
                    </span>
                  </div>
                </div>
                <metric.icon className={`h-8 w-8 text-${metric.color}-500 opacity-20`} />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Tabs defaultValue="performance" className="w-full">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="performance">Performance</TabsTrigger>
          <TabsTrigger value="geographic">Geographic</TabsTrigger>
          <TabsTrigger value="licensing">Licensing</TabsTrigger>
          <TabsTrigger value="utilization">Utilization</TabsTrigger>
          <TabsTrigger value="financial">Financial</TabsTrigger>
        </TabsList>

        <TabsContent value="performance" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle>Comparative Performance</CardTitle>
                <CardDescription>Adjusters vs Partners metrics</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {performanceData.map((item, index) => (
                    <div key={index}>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium">{item.name}</span>
                        <div className="flex gap-4 text-sm">
                          <span className="text-blue-600">A: {item.adjusters}</span>
                          <span className="text-purple-600">P: {item.partners}</span>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Progress 
                          value={(item.adjusters / (item.adjusters + item.partners)) * 100} 
                          className="flex-1"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Top Performers</CardTitle>
                <CardDescription>Highest rated resources this period</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {topPerformers.map((performer, index) => (
                    <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white font-bold ${
                          index === 0 ? 'bg-yellow-500' : 
                          index === 1 ? 'bg-gray-400' : 
                          index === 2 ? 'bg-orange-600' : 'bg-gray-300'
                        }`}>
                          {index + 1}
                        </div>
                        <div>
                          <p className="font-medium">{performer.name}</p>
                          <div className="flex items-center gap-2 mt-1">
                            <Badge variant="outline" className="text-xs">
                              {performer.type}
                            </Badge>
                            <span className="text-xs text-gray-500">
                              {performer.claims} claims
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="flex items-center gap-1">
                          <Activity className="h-3 w-3 text-yellow-500" />
                          <span className="font-medium">{performer.rating}</span>
                        </div>
                        <span className="text-xs text-gray-500">{performer.responseTime}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Performance Trends</CardTitle>
              <CardDescription>Key metrics over time</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-64 flex items-center justify-center text-gray-400">
                <BarChart3 className="h-12 w-12 mr-4" />
                <p>Performance chart visualization would go here</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="geographic" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Geographic Distribution</CardTitle>
              <CardDescription>Resource coverage by state</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="h-64 flex items-center justify-center text-gray-400 border rounded-lg">
                  <MapPin className="h-12 w-12 mr-4" />
                  <p>US Map visualization would go here</p>
                </div>
                <div className="space-y-2">
                  <h3 className="font-medium mb-3">Top States by Coverage</h3>
                  {[
                    { state: 'Florida', adjusters: 24, partners: 18, total: 42 },
                    { state: 'Texas', adjusters: 21, partners: 15, total: 36 },
                    { state: 'California', adjusters: 18, partners: 12, total: 30 },
                    { state: 'New York', adjusters: 15, partners: 10, total: 25 },
                    { state: 'Georgia', adjusters: 12, partners: 8, total: 20 }
                  ].map((state, index) => (
                    <div key={index} className="flex items-center justify-between p-2 hover:bg-gray-50 rounded">
                      <span className="font-medium">{state.state}</span>
                      <div className="flex items-center gap-4">
                        <Badge variant="outline" className="text-xs">
                          A: {state.adjusters}
                        </Badge>
                        <Badge variant="outline" className="text-xs">
                          P: {state.partners}
                        </Badge>
                        <span className="font-bold text-blue-600">{state.total}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-medium">States Covered</h3>
                  <MapPin className="h-5 w-5 text-gray-400" />
                </div>
                <p className="text-3xl font-bold">42</p>
                <p className="text-sm text-gray-500 mt-1">Out of 50 states</p>
                <Progress value={84} className="mt-3" />
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-medium">Underserved States</h3>
                  <AlertCircle className="h-5 w-5 text-yellow-500" />
                </div>
                <p className="text-3xl font-bold text-yellow-600">8</p>
                <p className="text-sm text-gray-500 mt-1">Need more coverage</p>
                <div className="flex flex-wrap gap-1 mt-3">
                  {['WY', 'ND', 'SD', 'VT', 'DE', 'RI', 'WV', 'AK'].map(state => (
                    <Badge key={state} variant="outline" className="text-xs">
                      {state}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-medium">Avg Resources/State</h3>
                  <Users className="h-5 w-5 text-gray-400" />
                </div>
                <p className="text-3xl font-bold">5.8</p>
                <p className="text-sm text-gray-500 mt-1">Resources per state</p>
                <div className="flex items-center gap-1 mt-3">
                  <TrendingUp className="h-4 w-4 text-green-500" />
                  <span className="text-sm text-green-500">+12% from last month</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="licensing" className="space-y-4">
          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              <strong>5 licenses expiring soon</strong> - Review and renew licenses to maintain compliance
            </AlertDescription>
          </Alert>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle>License Status Overview</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-5 w-5 text-green-500" />
                      <span>Active Licenses</span>
                    </div>
                    <span className="font-bold">342</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <AlertCircle className="h-5 w-5 text-yellow-500" />
                      <span>Expiring (30 days)</span>
                    </div>
                    <span className="font-bold text-yellow-600">15</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <XCircle className="h-5 w-5 text-red-500" />
                      <span>Expired</span>
                    </div>
                    <span className="font-bold text-red-600">3</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Upcoming Expirations</CardTitle>
                <CardDescription>Licenses expiring in the next 30 days</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {licenseExpirations.map((license, index) => (
                    <div key={index} className="flex items-center justify-between p-2 border rounded">
                      <div>
                        <p className="font-medium text-sm">{license.name}</p>
                        <p className="text-xs text-gray-500">{license.state} License</p>
                      </div>
                      <div className="text-right">
                        <Badge 
                          variant={license.daysLeft <= 14 ? 'destructive' : 'secondary'}
                          className="text-xs"
                        >
                          {license.daysLeft} days
                        </Badge>
                        <p className="text-xs text-gray-500 mt-1">{license.expires}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>License Distribution by State</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-64 flex items-center justify-center text-gray-400">
                <Award className="h-12 w-12 mr-4" />
                <p>License distribution chart would go here</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="utilization" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            <Card>
              <CardContent className="p-6">
                <h3 className="font-medium mb-4">Adjuster Utilization</h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Available</span>
                    <span className="font-medium">68</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Deployed</span>
                    <span className="font-medium">42</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Unavailable</span>
                    <span className="font-medium">46</span>
                  </div>
                  <div className="pt-3 border-t">
                    <div className="flex items-center justify-between">
                      <span className="font-medium">Utilization Rate</span>
                      <span className="text-xl font-bold text-blue-600">62%</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <h3 className="font-medium mb-4">Partner Utilization</h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Available</span>
                    <span className="font-medium">45</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Busy</span>
                    <span className="font-medium">28</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Unavailable</span>
                    <span className="font-medium">11</span>
                  </div>
                  <div className="pt-3 border-t">
                    <div className="flex items-center justify-between">
                      <span className="font-medium">Utilization Rate</span>
                      <span className="text-xl font-bold text-purple-600">58%</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <h3 className="font-medium mb-4">Deployment Metrics</h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Avg Deployment Duration</span>
                    <span className="font-medium">14 days</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Claims per Deployment</span>
                    <span className="font-medium">8.3</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Deployment Success Rate</span>
                    <span className="font-medium text-green-600">94%</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Utilization Trends</CardTitle>
              <CardDescription>Resource utilization over time</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-64 flex items-center justify-center text-gray-400">
                <Activity className="h-12 w-12 mr-4" />
                <p>Utilization trend chart would go here</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="financial" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-gray-500">Revenue Generated</span>
                  <DollarSign className="h-5 w-5 text-green-500" />
                </div>
                <p className="text-2xl font-bold">$2.4M</p>
                <div className="flex items-center gap-1 mt-2">
                  <ArrowUp className="h-3 w-3 text-green-500" />
                  <span className="text-xs text-green-500">+18% from last period</span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-gray-500">Cost Savings</span>
                  <TrendingUp className="h-5 w-5 text-blue-500" />
                </div>
                <p className="text-2xl font-bold">$450K</p>
                <div className="flex items-center gap-1 mt-2">
                  <ArrowUp className="h-3 w-3 text-green-500" />
                  <span className="text-xs text-green-500">+22% efficiency gain</span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-gray-500">Avg Claim Value</span>
                  <DollarSign className="h-5 w-5 text-purple-500" />
                </div>
                <p className="text-2xl font-bold">$18.5K</p>
                <div className="flex items-center gap-1 mt-2">
                  <Minus className="h-3 w-3 text-gray-400" />
                  <span className="text-xs text-gray-500">No change</span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-gray-500">ROI</span>
                  <BarChart3 className="h-5 w-5 text-orange-500" />
                </div>
                <p className="text-2xl font-bold">245%</p>
                <div className="flex items-center gap-1 mt-2">
                  <ArrowUp className="h-3 w-3 text-green-500" />
                  <span className="text-xs text-green-500">+15% improvement</span>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Financial Performance</CardTitle>
              <CardDescription>Revenue and cost analysis</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-64 flex items-center justify-center text-gray-400">
                <DollarSign className="h-12 w-12 mr-4" />
                <p>Financial performance chart would go here</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AnalyticsDashboard;