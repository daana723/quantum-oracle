import React from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, BarChart3, Flame, Droplets, Wind, Mountain, Sparkles } from "lucide-react";
import { Helmet } from "react-helmet-async";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area,
  RadarChart,
  Radar,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useReadingHistory } from "@/hooks/useReadingHistory";
import {
  getCardFrequencies,
  getElementDistribution,
  getThemeFrequencies,
  getWeeklyActivity,
  getIntentDistribution,
} from "@/data/analyticsEngine";

const ELEMENT_ICONS: Record<string, React.ReactNode> = {
  Fire: <Flame className="h-4 w-4" />,
  Water: <Droplets className="h-4 w-4" />,
  Air: <Wind className="h-4 w-4" />,
  Earth: <Mountain className="h-4 w-4" />,
  Spirit: <Sparkles className="h-4 w-4" />,
};

const CustomTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-lg border border-border bg-card px-3 py-2 text-sm shadow-lg">
      <p className="font-display text-gold">{label || payload[0]?.name}</p>
      <p className="font-body text-foreground/80">{payload[0]?.value} appearances</p>
    </div>
  );
};

const PatternAnalytics: React.FC = () => {
  const { readings } = useReadingHistory();

  const cardFreqs = getCardFrequencies(readings);
  const elements = getElementDistribution(readings);
  const themes = getThemeFrequencies(readings);
  const weekly = getWeeklyActivity(readings);
  const intents = getIntentDistribution(readings);

  const totalCards = readings.reduce((sum, r) => sum + 1 + r.echoCards.length, 0);

  return (
    <>
      <Helmet>
        <title>Pattern Analytics — Victorian Quantum Veil</title>
        <meta name="description" content="Discover recurring patterns in your tarot readings — cards, elements, and themes over time." />
      </Helmet>

      <div className="min-h-screen bg-cosmic bg-nebula-overlay bg-vignette">
        {/* Header */}
        <header className="relative z-20 px-4 py-4 md:py-6 flex items-center gap-3">
          <Link
            to="/"
            className="text-gold/60 hover:text-gold transition-colors"
          >
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <div className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5 text-gold/70" />
            <h1 className="font-display text-lg md:text-xl text-gold-gradient tracking-widest">
              Pattern Analytics
            </h1>
          </div>
        </header>

        <main className="relative z-10 px-4 pb-12 max-w-4xl mx-auto space-y-6">
          {readings.length === 0 ? (
            <div className="text-center py-20 space-y-4">
              <Sparkles className="h-12 w-12 text-gold/30 mx-auto" />
              <p className="font-display text-lg text-gold/60">No readings yet</p>
              <p className="font-body text-muted-foreground italic">
                Complete some readings to see your patterns emerge.
              </p>
              <Link
                to="/"
                className="inline-block mt-4 px-6 py-2 rounded-full border border-gold/50 text-gold font-display text-sm tracking-wider hover:bg-gold/10 transition-colors"
              >
                Begin a Reading
              </Link>
            </div>
          ) : (
            <>
              {/* Summary stats */}
              <div className="grid grid-cols-3 gap-3">
                {[
                  { label: "Readings", value: readings.length },
                  { label: "Cards Drawn", value: totalCards },
                  { label: "Unique Cards", value: cardFreqs.length },
                ].map((stat) => (
                  <Card key={stat.label} className="border-gold/20 bg-card/80 backdrop-blur-sm">
                    <CardContent className="p-4 text-center">
                      <p className="font-display text-2xl text-gold">{stat.value}</p>
                      <p className="font-body text-xs text-muted-foreground">{stat.label}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>

              <Tabs defaultValue="cards" className="space-y-4">
                <TabsList className="bg-muted/50 border border-gold/20 w-full grid grid-cols-4">
                  <TabsTrigger value="cards" className="font-display text-xs data-[state=active]:text-gold data-[state=active]:bg-card">
                    Cards
                  </TabsTrigger>
                  <TabsTrigger value="elements" className="font-display text-xs data-[state=active]:text-gold data-[state=active]:bg-card">
                    Elements
                  </TabsTrigger>
                  <TabsTrigger value="themes" className="font-display text-xs data-[state=active]:text-gold data-[state=active]:bg-card">
                    Themes
                  </TabsTrigger>
                  <TabsTrigger value="activity" className="font-display text-xs data-[state=active]:text-gold data-[state=active]:bg-card">
                    Activity
                  </TabsTrigger>
                </TabsList>

                {/* Card frequency */}
                <TabsContent value="cards">
                  <Card className="border-gold/20 bg-card/80 backdrop-blur-sm">
                    <CardHeader className="pb-2">
                      <CardTitle className="font-display text-base text-gold/90">
                        Most Frequent Cards
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="h-64">
                        <ResponsiveContainer width="100%" height="100%">
                          <BarChart data={cardFreqs} layout="vertical" margin={{ left: 80, right: 16 }}>
                            <XAxis type="number" allowDecimals={false} tick={{ fill: "hsl(45, 30%, 55%)", fontSize: 11 }} />
                            <YAxis
                              type="category"
                              dataKey="name"
                              tick={{ fill: "hsl(45, 80%, 55%)", fontSize: 11, fontFamily: "Cinzel" }}
                              width={75}
                            />
                            <Tooltip content={<CustomTooltip />} />
                            <Bar dataKey="count" fill="hsl(45, 80%, 55%)" radius={[0, 4, 4, 0]} barSize={16} />
                          </BarChart>
                        </ResponsiveContainer>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                {/* Element distribution */}
                <TabsContent value="elements">
                  <Card className="border-gold/20 bg-card/80 backdrop-blur-sm">
                    <CardHeader className="pb-2">
                      <CardTitle className="font-display text-base text-gold/90">
                        Elemental Balance
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="h-64 flex items-center justify-center">
                        <ResponsiveContainer width="100%" height="100%">
                          <PieChart>
                            <Pie
                              data={elements}
                              dataKey="count"
                              nameKey="element"
                              cx="50%"
                              cy="50%"
                              outerRadius={90}
                              innerRadius={45}
                              strokeWidth={2}
                              stroke="hsl(350, 35%, 8%)"
                            >
                              {elements.map((entry, i) => (
                                <Cell key={i} fill={entry.fill} />
                              ))}
                            </Pie>
                            <Tooltip content={<CustomTooltip />} />
                          </PieChart>
                        </ResponsiveContainer>
                      </div>
                      {/* Legend */}
                      <div className="flex flex-wrap justify-center gap-4 mt-2">
                        {elements.map((el) => (
                          <div key={el.element} className="flex items-center gap-1.5 text-sm font-body">
                            <div className="w-3 h-3 rounded-full" style={{ backgroundColor: el.fill }} />
                            <span className="text-foreground/70 flex items-center gap-1">
                              {ELEMENT_ICONS[el.element]} {el.element}
                            </span>
                            <span className="text-gold/60 text-xs">({el.count})</span>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                {/* Themes radar */}
                <TabsContent value="themes">
                  <Card className="border-gold/20 bg-card/80 backdrop-blur-sm">
                    <CardHeader className="pb-2">
                      <CardTitle className="font-display text-base text-gold/90">
                        Theme Resonance
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="h-72">
                        <ResponsiveContainer width="100%" height="100%">
                          <RadarChart data={themes} cx="50%" cy="50%" outerRadius="70%">
                            <PolarGrid stroke="hsl(45, 30%, 25%)" />
                            <PolarAngleAxis
                              dataKey="theme"
                              tick={{ fill: "hsl(45, 80%, 55%)", fontSize: 12, fontFamily: "Cinzel" }}
                            />
                            <PolarRadiusAxis tick={false} axisLine={false} />
                            <Radar
                              dataKey="count"
                              stroke="hsl(45, 80%, 55%)"
                              fill="hsl(45, 80%, 55%)"
                              fillOpacity={0.2}
                              strokeWidth={2}
                            />
                            <Tooltip content={<CustomTooltip />} />
                          </RadarChart>
                        </ResponsiveContainer>
                      </div>

                      {/* Intent distribution */}
                      {intents.length > 1 && (
                        <div className="mt-6 pt-4 border-t border-gold/15">
                          <p className="font-display text-sm text-gold/70 mb-3">Intent Patterns</p>
                          <div className="space-y-2">
                            {intents.map((item) => (
                              <div key={item.intent} className="flex items-center gap-3">
                                <span className="font-body text-sm text-foreground/70 w-24 truncate">
                                  {item.intent}
                                </span>
                                <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
                                  <div
                                    className="h-full bg-gold/60 rounded-full transition-all"
                                    style={{
                                      width: `${(item.count / Math.max(...intents.map((i) => i.count))) * 100}%`,
                                    }}
                                  />
                                </div>
                                <span className="font-body text-xs text-gold/50 w-6 text-right">
                                  {item.count}
                                </span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </TabsContent>

                {/* Weekly activity */}
                <TabsContent value="activity">
                  <Card className="border-gold/20 bg-card/80 backdrop-blur-sm">
                    <CardHeader className="pb-2">
                      <CardTitle className="font-display text-base text-gold/90">
                        Reading Activity (8 Weeks)
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="h-48">
                        <ResponsiveContainer width="100%" height="100%">
                          <AreaChart data={weekly} margin={{ left: 0, right: 8 }}>
                            <defs>
                              <linearGradient id="goldGradient" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="0%" stopColor="hsl(45, 80%, 55%)" stopOpacity={0.4} />
                                <stop offset="100%" stopColor="hsl(45, 80%, 55%)" stopOpacity={0} />
                              </linearGradient>
                            </defs>
                            <XAxis
                              dataKey="week"
                              tick={{ fill: "hsl(45, 30%, 55%)", fontSize: 11 }}
                            />
                            <YAxis allowDecimals={false} tick={{ fill: "hsl(45, 30%, 55%)", fontSize: 11 }} />
                            <Tooltip content={<CustomTooltip />} />
                            <Area
                              type="monotone"
                              dataKey="readings"
                              stroke="hsl(45, 80%, 55%)"
                              fill="url(#goldGradient)"
                              strokeWidth={2}
                            />
                          </AreaChart>
                        </ResponsiveContainer>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            </>
          )}
        </main>
      </div>
    </>
  );
};

export default PatternAnalytics;
