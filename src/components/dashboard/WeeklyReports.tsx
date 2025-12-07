import { useState, useEffect } from "react";
import { FileText, Download, Calendar, Shield, AlertTriangle, TrendingUp } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface WeeklyReportsProps {
  userId: string;
}

interface ThreatSummary {
  type: string;
  count: number;
}

const WeeklyReports = ({ userId }: WeeklyReportsProps) => {
  const [loading, setLoading] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [reportData, setReportData] = useState<{
    threatCount: number;
    safetyScore: number;
    threatsByType: ThreatSummary[];
    recentThreats: any[];
    weekStart: string;
    weekEnd: string;
  } | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    generateReportData();
  }, [userId]);

  const generateReportData = async () => {
    setLoading(true);
    const weekEnd = new Date();
    const weekStart = new Date();
    weekStart.setDate(weekStart.getDate() - 7);

    // Get threats from the last week
    const { data: threats, count } = await supabase
      .from("threat_logs")
      .select("*", { count: "exact" })
      .eq("user_id", userId)
      .gte("blocked_at", weekStart.toISOString())
      .lte("blocked_at", weekEnd.toISOString())
      .order("blocked_at", { ascending: false });

    // Group by type
    const threatsByType: { [key: string]: number } = {};
    threats?.forEach((t) => {
      threatsByType[t.threat_type] = (threatsByType[t.threat_type] || 0) + 1;
    });

    const threatSummary = Object.entries(threatsByType).map(([type, count]) => ({
      type,
      count,
    }));

    // Calculate safety score
    const safetyScore = Math.max(100 - (count || 0) * 5, 0);

    setReportData({
      threatCount: count || 0,
      safetyScore,
      threatsByType: threatSummary,
      recentThreats: threats?.slice(0, 5) || [],
      weekStart: weekStart.toLocaleDateString(),
      weekEnd: weekEnd.toLocaleDateString(),
    });
    setLoading(false);
  };

  const downloadPDF = async () => {
    if (!reportData) return;
    setGenerating(true);

    // Generate PDF content as HTML
    const htmlContent = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>SafeLaylar Weekly Safety Report</title>
  <style>
    body { font-family: 'Helvetica', sans-serif; padding: 40px; color: #250E83; }
    .header { text-align: center; margin-bottom: 40px; border-bottom: 3px solid #BE006C; padding-bottom: 20px; }
    .logo { font-size: 28px; font-weight: bold; color: #507CDD; }
    .subtitle { color: #666; margin-top: 5px; }
    .date-range { color: #BE006C; font-weight: 500; margin-top: 10px; }
    .stats { display: flex; justify-content: space-around; margin: 30px 0; }
    .stat { text-align: center; padding: 20px; background: linear-gradient(135deg, #f0f4ff 0%, #fce7f3 100%); border-radius: 12px; }
    .stat-value { font-size: 36px; font-weight: bold; color: #507CDD; }
    .stat-label { color: #666; margin-top: 5px; }
    .section { margin: 30px 0; }
    .section-title { font-size: 18px; font-weight: bold; color: #250E83; border-left: 4px solid #DC7AEB; padding-left: 10px; margin-bottom: 15px; }
    .threat-item { padding: 12px; background: #f8f9fa; border-radius: 8px; margin-bottom: 10px; border-left: 3px solid #BE006C; }
    .threat-type { font-weight: bold; color: #250E83; }
    .threat-desc { color: #666; font-size: 14px; margin-top: 5px; }
    .severity { display: inline-block; padding: 2px 8px; border-radius: 12px; font-size: 12px; font-weight: bold; }
    .severity-critical { background: #fee2e2; color: #dc2626; }
    .severity-high { background: #fce7f3; color: #BE006C; }
    .severity-medium { background: #f3e8ff; color: #7c3aed; }
    .severity-low { background: #e0f2fe; color: #0284c7; }
    .tips { background: linear-gradient(135deg, #507CDD10 0%, #DC7AEB10 100%); padding: 20px; border-radius: 12px; }
    .tip { padding: 8px 0; border-bottom: 1px solid #e5e7eb; }
    .tip:last-child { border-bottom: none; }
    .footer { text-align: center; margin-top: 40px; padding-top: 20px; border-top: 1px solid #e5e7eb; color: #666; font-size: 12px; }
  </style>
</head>
<body>
  <div class="header">
    <div class="logo">🛡️ SafeLaylar</div>
    <div class="subtitle">Weekly Safety Report</div>
    <div class="date-range">${reportData.weekStart} - ${reportData.weekEnd}</div>
  </div>

  <div class="stats">
    <div class="stat">
      <div class="stat-value">${reportData.safetyScore}%</div>
      <div class="stat-label">Safety Score</div>
    </div>
    <div class="stat">
      <div class="stat-value">${reportData.threatCount}</div>
      <div class="stat-label">Threats Blocked</div>
    </div>
    <div class="stat">
      <div class="stat-value">${reportData.threatsByType.length}</div>
      <div class="stat-label">Threat Categories</div>
    </div>
  </div>

  <div class="section">
    <div class="section-title">Threats by Category</div>
    ${reportData.threatsByType.map(t => `
      <div class="threat-item">
        <span class="threat-type">${t.type}</span>
        <span style="float: right; color: #BE006C; font-weight: bold;">${t.count} blocked</span>
      </div>
    `).join('')}
    ${reportData.threatsByType.length === 0 ? '<p style="color: #666;">No threats detected this week. Great job!</p>' : ''}
  </div>

  <div class="section">
    <div class="section-title">Recent Threats</div>
    ${reportData.recentThreats.map(t => `
      <div class="threat-item">
        <div class="threat-type">${t.threat_type} <span class="severity severity-${t.severity.toLowerCase()}">${t.severity}</span></div>
        <div class="threat-desc">${t.description}</div>
        <div style="font-size: 12px; color: #999; margin-top: 5px;">${new Date(t.blocked_at).toLocaleString()}</div>
      </div>
    `).join('')}
    ${reportData.recentThreats.length === 0 ? '<p style="color: #666;">No recent threats to display.</p>' : ''}
  </div>

  <div class="section">
    <div class="section-title">Safety Tips</div>
    <div class="tips">
      <div class="tip">✓ Be cautious of unsolicited messages from strangers</div>
      <div class="tip">✓ Never share personal information like your address or phone number</div>
      <div class="tip">✓ Use strong, unique passwords for each account</div>
      <div class="tip">✓ Report suspicious behavior to a trusted adult</div>
      <div class="tip">✓ Keep SafeLaylar updated for the latest protection</div>
    </div>
  </div>

  <div class="footer">
    <p>Generated by SafeLaylar • Your Digital Shield for a Safer Online World</p>
    <p>© 2025 SafeLaylar. All rights reserved.</p>
  </div>
</body>
</html>
    `;

    // Create a blob and download
    const blob = new Blob([htmlContent], { type: "text/html" });
    const url = URL.createObjectURL(blob);
    
    // Open in new window for printing as PDF
    const printWindow = window.open(url, "_blank");
    if (printWindow) {
      printWindow.onload = () => {
        printWindow.print();
      };
    }

    toast({
      title: "Report Generated",
      description: "Use your browser's print dialog to save as PDF.",
    });
    setGenerating(false);
  };

  const getSeverityColor = (severity: string) => {
    switch (severity.toLowerCase()) {
      case "critical":
        return "bg-destructive text-destructive-foreground";
      case "high":
        return "bg-accent text-accent-foreground";
      case "medium":
        return "bg-secondary text-secondary-foreground";
      default:
        return "bg-muted text-muted-foreground";
    }
  };

  if (loading) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        Generating report data...
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-foreground flex items-center gap-2">
            <FileText className="w-6 h-6 text-secondary" />
            Weekly Safety Report
          </h2>
          <p className="text-muted-foreground">
            {reportData?.weekStart} - {reportData?.weekEnd}
          </p>
        </div>
        <Button
          onClick={downloadPDF}
          disabled={generating}
          className="bg-gradient-to-r from-primary to-secondary hover:opacity-90"
        >
          <Download className="w-4 h-4 mr-2" />
          {generating ? "Generating..." : "Download PDF"}
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="border-border/50 bg-gradient-to-br from-card to-secondary/10">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Safety Score</p>
                <p className="text-3xl font-bold text-foreground">{reportData?.safetyScore}%</p>
              </div>
              <Shield className="w-10 h-10 text-secondary" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-border/50 bg-gradient-to-br from-card to-accent/10">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Threats Blocked</p>
                <p className="text-3xl font-bold text-foreground">{reportData?.threatCount}</p>
              </div>
              <AlertTriangle className="w-10 h-10 text-accent" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-border/50 bg-gradient-to-br from-card to-primary/10">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Threat Categories</p>
                <p className="text-3xl font-bold text-foreground">{reportData?.threatsByType.length}</p>
              </div>
              <TrendingUp className="w-10 h-10 text-primary" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Threats by Type */}
      <Card className="border-border/50 bg-card">
        <CardHeader>
          <CardTitle className="text-lg">Threats by Category</CardTitle>
        </CardHeader>
        <CardContent>
          {reportData?.threatsByType.length === 0 ? (
            <p className="text-muted-foreground text-center py-4">
              No threats detected this week. Great job staying safe!
            </p>
          ) : (
            <div className="space-y-3">
              {reportData?.threatsByType.map((t, i) => (
                <div key={i} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                  <span className="font-medium text-foreground">{t.type}</span>
                  <Badge className="bg-accent text-accent-foreground">{t.count} blocked</Badge>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Recent Threats */}
      <Card className="border-border/50 bg-card">
        <CardHeader>
          <CardTitle className="text-lg">Recent Threats</CardTitle>
        </CardHeader>
        <CardContent>
          {reportData?.recentThreats.length === 0 ? (
            <p className="text-muted-foreground text-center py-4">No recent threats to display.</p>
          ) : (
            <div className="space-y-3">
              {reportData?.recentThreats.map((threat) => (
                <div key={threat.id} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                  <div>
                    <div className="font-medium text-foreground">{threat.threat_type}</div>
                    <div className="text-sm text-muted-foreground">{threat.description}</div>
                    <div className="text-xs text-muted-foreground mt-1">
                      {new Date(threat.blocked_at).toLocaleString()}
                    </div>
                  </div>
                  <Badge className={getSeverityColor(threat.severity)}>{threat.severity}</Badge>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Safety Tips */}
      <Card className="border-border/50 bg-gradient-to-br from-secondary/10 to-accent/10">
        <CardHeader>
          <CardTitle className="text-lg">Safety Tips for This Week</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-3">
            <li className="flex items-start gap-2">
              <span className="text-secondary">✓</span>
              <span className="text-muted-foreground">Be cautious of unsolicited messages from strangers</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-secondary">✓</span>
              <span className="text-muted-foreground">Never share personal information like your address or phone number</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-secondary">✓</span>
              <span className="text-muted-foreground">Use strong, unique passwords for each account</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-secondary">✓</span>
              <span className="text-muted-foreground">Report suspicious behavior to a trusted adult</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-secondary">✓</span>
              <span className="text-muted-foreground">Keep SafeLaylar updated for the latest protection</span>
            </li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
};

export default WeeklyReports;
