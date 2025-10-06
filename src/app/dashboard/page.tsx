"use client";

import { useAuth } from "@/hooks/useAuth";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { AppLayout } from "@/components/layout/app-layout";
import { Trophy, Zap, TrendingUp, Gamepad2, Clock, Award } from "lucide-react";

const DashboardPage = () => {
  const { user, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !user) {
      router.push("/auth");
    }
  }, [user, isLoading, router]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-gray-300 border-t-purple-600" />
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  // Calculate progress percentages
  const scoreProgress = Math.min((user.score / 100) * 100, 100);
  const turnsProgress = Math.min((user.turns / 10) * 100, 100);

  return (
    <AppLayout>
      <div className="space-y-6">
        {/* Welcome Section */}
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Xin chào, {user.username}! 👋
          </h1>
          <p className="text-muted-foreground mt-1">
            Chào mừng trở lại với Game Number
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Tổng điểm</CardTitle>
              <Trophy className="h-4 w-4 text-yellow-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{user.score}</div>
              <Progress value={scoreProgress} className="mt-2" />
              <p className="text-xs text-muted-foreground mt-2">
                {scoreProgress.toFixed(0)}% đến mục tiêu 100
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Lượt chơi</CardTitle>
              <Zap className="h-4 w-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{user.turns}</div>
              <Progress value={turnsProgress} className="mt-2" />
              <p className="text-xs text-muted-foreground mt-2">
                {user.turns > 0 ? `${user.turns} lượt còn lại` : "Hết lượt chơi"}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Trạng thái</CardTitle>
              <TrendingUp className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2 mt-2">
                <Badge variant={user.turns > 0 ? "default" : "destructive"} className="text-sm">
                  {user.turns > 0 ? "🎮 Active" : "⏸️ Inactive"}
                </Badge>
              </div>
              <p className="text-xs text-muted-foreground mt-3">
                {user.turns > 0 
                  ? "Sẵn sàng chơi game" 
                  : "Cần mua thêm lượt chơi"}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Hạng</CardTitle>
              <Award className="h-4 w-4 text-purple-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {user.score >= 50 ? "🥇 Gold" : user.score >= 20 ? "🥈 Silver" : "🥉 Bronze"}
              </div>
              <p className="text-xs text-muted-foreground mt-3">
                Dựa trên tổng điểm
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Hành động nhanh</CardTitle>
            <CardDescription>
              Chọn hoạt động bạn muốn thực hiện
            </CardDescription>
          </CardHeader>
          <CardContent className="grid gap-3 md:grid-cols-3">
            <Button 
              onClick={() => router.push("/game")} 
              className="gap-2 h-20 flex-col"
              size="lg"
              disabled={!user.turns || user.turns <= 0}
            >
              <Gamepad2 className="h-6 w-6" />
              <span>Chơi Game</span>
            </Button>
            <Button 
              onClick={() => router.push("/history")} 
              variant="outline"
              className="gap-2 h-20 flex-col"
              size="lg"
            >
              <Clock className="h-6 w-6" />
              <span>Lịch sử</span>
            </Button>
            <Button 
              onClick={() => router.push("/shop")} 
              variant="outline"
              className="gap-2 h-20 flex-col"
              size="lg"
            >
              <Zap className="h-6 w-6" />
              <span>Mua lượt chơi</span>
            </Button>
          </CardContent>
        </Card>

        {/* Recent Activity */}
        <Card>
          <CardHeader>
            <CardTitle>Thông tin tài khoản</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex justify-between items-center py-2 border-b">
              <span className="text-sm text-muted-foreground">Username</span>
              <span className="font-medium">{user.username}</span>
            </div>
            <div className="flex justify-between items-center py-2 border-b">
              <span className="text-sm text-muted-foreground">Email</span>
              <span className="font-medium">{user.email}</span>
            </div>
            <div className="flex justify-between items-center py-2 border-b">
              <span className="text-sm text-muted-foreground">Tổng điểm</span>
              <Badge variant="secondary" className="font-bold">
                {user.score} points
              </Badge>
            </div>
            <div className="flex justify-between items-center py-2">
              <span className="text-sm text-muted-foreground">Lượt chơi còn lại</span>
              <Badge variant={user.turns > 0 ? "default" : "destructive"} className="font-bold">
                {user.turns} turns
              </Badge>
            </div>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
};

export default DashboardPage;
