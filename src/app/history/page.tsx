"use client";

import { useAuth } from "@/hooks/useAuth";
import { useGameHistory } from "@/hooks/useGameHistory";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { AppLayout } from "@/components/layout/app-layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { CheckCircle2, XCircle, Clock, Trophy } from "lucide-react";
import { format } from "date-fns";
import { vi } from "date-fns/locale";

const HistoryPage = () => {
  const { user, isLoading: authLoading } = useAuth();
  const router = useRouter();
  const { data: history, isLoading: historyLoading, error } = useGameHistory();

  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/auth");
    }
  }, [user, authLoading, router]);

  if (authLoading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-gray-300 border-t-purple-600" />
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  const totalGames = history?.length || 0;
  const wins = history?.filter((game) => game.isCorrect).length || 0;
  const losses = totalGames - wins;
  const winRate = totalGames > 0 ? ((wins / totalGames) * 100).toFixed(1) : "0.0";

  return (
    <AppLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Lịch sử chơi game</h1>
          <p className="text-muted-foreground mt-1">
            Xem lại tất cả các lượt chơi của bạn
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid gap-4 md:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Tổng số lượt</CardTitle>
              <Clock className="h-4 w-4 text-gray-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalGames}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Thắng</CardTitle>
              <CheckCircle2 className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">{wins}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Thua</CardTitle>
              <XCircle className="h-4 w-4 text-red-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-600">{losses}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Tỉ lệ thắng</CardTitle>
              <Trophy className="h-4 w-4 text-yellow-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{winRate}%</div>
            </CardContent>
          </Card>
        </div>

        {/* History List */}
        <Card>
          <CardHeader>
            <CardTitle>Lịch sử chi tiết</CardTitle>
            <CardDescription>
              Danh sách các lượt chơi gần đây nhất
            </CardDescription>
          </CardHeader>
          <CardContent>
            {historyLoading ? (
              <div className="space-y-3">
                {[1, 2, 3, 4, 5].map((i) => (
                  <div key={i} className="flex items-center gap-4 p-4 border rounded-lg">
                    <Skeleton className="h-10 w-10 rounded-full" />
                    <div className="flex-1 space-y-2">
                      <Skeleton className="h-4 w-1/4" />
                      <Skeleton className="h-3 w-1/2" />
                    </div>
                    <Skeleton className="h-6 w-16" />
                  </div>
                ))}
              </div>
            ) : error ? (
              <div className="text-center py-8 text-red-600">
                Không thể tải lịch sử. Vui lòng thử lại sau.
              </div>
            ) : !history || history.length === 0 ? (
              <div className="text-center py-12 text-muted-foreground">
                <Clock className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p className="text-lg font-medium">Chưa có lịch sử chơi game</p>
                <p className="text-sm mt-1">Bắt đầu chơi để xem lịch sử tại đây!</p>
              </div>
            ) : (
              <div className="space-y-2">
                {history.map((game) => (
                  <div
                    key={game.id}
                    className={`flex items-center gap-4 p-4 border rounded-lg transition-colors ${
                      game.isCorrect
                        ? "border-green-200 bg-green-50/50 hover:bg-green-50"
                        : "border-red-200 bg-red-50/50 hover:bg-red-50"
                    }`}
                  >
                    <div
                      className={`flex items-center justify-center h-10 w-10 rounded-full ${
                        game.isCorrect ? "bg-green-100" : "bg-red-100"
                      }`}
                    >
                      {game.isCorrect ? (
                        <CheckCircle2 className="h-6 w-6 text-green-600" />
                      ) : (
                        <XCircle className="h-6 w-6 text-red-600" />
                      )}
                    </div>

                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <p className="font-medium">
                          Đoán: <span className="text-purple-600">{game.guessedNumber}</span> | 
                          Đúng: <span className="text-blue-600">{game.actualNumber}</span>
                        </p>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {format(new Date(game.playedAt), "dd/MM/yyyy HH:mm:ss", { locale: vi })}
                      </p>
                    </div>

                    <div className="flex items-center gap-2">
                      <Badge variant={game.isCorrect ? "default" : "destructive"}>
                        {game.isCorrect ? "Thắng" : "Thua"}
                      </Badge>
                      {game.scoreEarned > 0 && (
                        <Badge variant="secondary">
                          +{game.scoreEarned} điểm
                        </Badge>
                      )}
                    </div>
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

export default HistoryPage;
