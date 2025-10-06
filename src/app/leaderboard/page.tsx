"use client";

import { useAuth } from "@/hooks/useAuth";
import { useLeaderboard } from "@/hooks/useLeaderboard";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { AppLayout } from "@/components/layout/app-layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Trophy, Medal, Award, Crown } from "lucide-react";

const LeaderboardPage = () => {
  const { user, isLoading: authLoading } = useAuth();
  const router = useRouter();
  const { data: leaderboard, isLoading: leaderboardLoading, error } = useLeaderboard();

  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/auth");
    }
  }, [user, authLoading, router]);

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-gray-300 border-t-purple-600" />
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return <Crown className="h-5 w-5 text-yellow-500" />;
      case 2:
        return <Medal className="h-5 w-5 text-gray-400" />;
      case 3:
        return <Award className="h-5 w-5 text-amber-600" />;
      default:
        return null;
    }
  };

  const getRankBadgeVariant = (rank: number) => {
    switch (rank) {
      case 1:
        return "default";
      case 2:
      case 3:
        return "secondary";
      default:
        return "outline";
    }
  };

  const getUserInitials = (username: string) => {
    return username.substring(0, 2).toUpperCase();
  };

  return (
    <AppLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Bảng xếp hạng</h1>
          <p className="text-muted-foreground mt-1">
            Top 100 người chơi xuất sắc nhất
          </p>
        </div>

        {/* User's Rank Card */}
        {user && user.rank && (
          <Card className="border-purple-200 bg-gradient-to-r from-purple-50 to-pink-50">
            <CardHeader>
              <CardTitle className="text-lg">Xếp hạng của bạn</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-4">
                <Badge variant="default" className="text-lg px-4 py-2">
                  #{user.rank}
                </Badge>
                <div className="flex-1">
                  <p className="font-medium">{user.username}</p>
                  <p className="text-sm text-muted-foreground">{user.score} điểm</p>
                </div>
                <Trophy className="h-8 w-8 text-purple-600" />
              </div>
            </CardContent>
          </Card>
        )}

        {/* Top 3 Podium */}
        {leaderboard && leaderboard.length >= 3 && (
          <div className="grid grid-cols-3 gap-4 mb-6">
            {/* 2nd Place */}
            <Card className="mt-8">
              <CardContent className="pt-6 text-center">
                <div className="mb-4 flex justify-center">
                  <Avatar className="h-16 w-16 border-4 border-gray-400">
                    <AvatarFallback className="bg-gradient-to-br from-gray-400 to-gray-500 text-white text-xl">
                      {getUserInitials(leaderboard[1].username)}
                    </AvatarFallback>
                  </Avatar>
                </div>
                <Medal className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                <p className="font-bold text-lg">{leaderboard[1].username}</p>
                <p className="text-2xl font-bold text-gray-600 mt-2">{leaderboard[1].score}</p>
                <p className="text-sm text-muted-foreground">điểm</p>
              </CardContent>
            </Card>

            {/* 1st Place */}
            <Card className="border-yellow-400 bg-gradient-to-b from-yellow-50 to-white">
              <CardContent className="pt-6 text-center">
                <div className="mb-4 flex justify-center">
                  <Avatar className="h-20 w-20 border-4 border-yellow-400">
                    <AvatarFallback className="bg-gradient-to-br from-yellow-400 to-yellow-600 text-white text-2xl">
                      {getUserInitials(leaderboard[0].username)}
                    </AvatarFallback>
                  </Avatar>
                </div>
                <Crown className="h-10 w-10 text-yellow-500 mx-auto mb-2" />
                <p className="font-bold text-xl">{leaderboard[0].username}</p>
                <p className="text-3xl font-bold text-yellow-600 mt-2">{leaderboard[0].score}</p>
                <p className="text-sm text-muted-foreground">điểm</p>
              </CardContent>
            </Card>

            {/* 3rd Place */}
            <Card className="mt-8">
              <CardContent className="pt-6 text-center">
                <div className="mb-4 flex justify-center">
                  <Avatar className="h-16 w-16 border-4 border-amber-600">
                    <AvatarFallback className="bg-gradient-to-br from-amber-600 to-amber-700 text-white text-xl">
                      {getUserInitials(leaderboard[2].username)}
                    </AvatarFallback>
                  </Avatar>
                </div>
                <Award className="h-8 w-8 text-amber-600 mx-auto mb-2" />
                <p className="font-bold text-lg">{leaderboard[2].username}</p>
                <p className="text-2xl font-bold text-amber-600 mt-2">{leaderboard[2].score}</p>
                <p className="text-sm text-muted-foreground">điểm</p>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Full Leaderboard */}
        <Card>
          <CardHeader>
            <CardTitle>Toàn bộ bảng xếp hạng</CardTitle>
            <CardDescription>
              Cập nhật mỗi 5 phút
            </CardDescription>
          </CardHeader>
          <CardContent>
            {leaderboardLoading ? (
              <div className="space-y-3">
                {[1, 2, 3, 4, 5].map((i) => (
                  <div key={i} className="flex items-center gap-4 p-3 border rounded-lg">
                    <Skeleton className="h-10 w-10 rounded-full" />
                    <div className="flex-1 space-y-2">
                      <Skeleton className="h-4 w-1/4" />
                      <Skeleton className="h-3 w-1/3" />
                    </div>
                    <Skeleton className="h-6 w-16" />
                  </div>
                ))}
              </div>
            ) : error ? (
              <div className="text-center py-8 text-red-600">
                Không thể tải bảng xếp hạng. Vui lòng thử lại sau.
              </div>
            ) : !leaderboard || leaderboard.length === 0 ? (
              <div className="text-center py-12 text-muted-foreground">
                <Trophy className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p className="text-lg font-medium">Chưa có dữ liệu xếp hạng</p>
              </div>
            ) : !Array.isArray(leaderboard) ? (
              <div className="text-center py-8 text-red-600">
                Dữ liệu không hợp lệ: {typeof leaderboard}
              </div>
            ) : (
              <div className="space-y-2">
                {leaderboard.map((entry) => (
                  <div
                    key={entry.userId}
                    className={`flex items-center gap-4 p-3 border rounded-lg transition-colors ${
                      user?.id === entry.userId
                        ? "border-purple-300 bg-purple-50"
                        : "hover:bg-gray-50"
                    }`}
                  >
                    <div className="flex items-center gap-3 flex-1">
                      <div className="w-8 text-center">
                        {getRankIcon(entry.rank) || (
                          <span className="text-lg font-bold text-muted-foreground">
                            {entry.rank}
                          </span>
                        )}
                      </div>

                      <Avatar className="h-10 w-10">
                        <AvatarFallback
                          className={
                            entry.rank <= 3
                              ? "bg-gradient-to-br from-purple-500 to-pink-500 text-white"
                              : "bg-gradient-to-br from-gray-400 to-gray-500 text-white"
                          }
                        >
                          {getUserInitials(entry.username)}
                        </AvatarFallback>
                      </Avatar>

                      <div className="flex-1">
                        <p className="font-medium">
                          {entry.username}
                          {user?.id === entry.userId && (
                            <Badge variant="outline" className="ml-2">
                              You
                            </Badge>
                          )}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          User ID: {entry.userId}
                        </p>
                      </div>
                    </div>

                    <Badge variant={getRankBadgeVariant(entry.rank)} className="text-base px-3 py-1">
                      {entry.score} điểm
                    </Badge>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
};

export default LeaderboardPage;
