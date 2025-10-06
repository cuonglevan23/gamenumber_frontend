"use client";

import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { gameService } from "@/services/game.service";
import { userService } from "@/services/user.service";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";
import { Sparkles, Trophy, Zap } from "lucide-react";

const NUMBERS = [1, 2, 3, 4, 5];

export const GameBoard = () => {
  const { user, refreshUserData } = useAuth();
  const [selectedNumber, setSelectedNumber] = useState<number | null>(null);
  const [lastResult, setLastResult] = useState<{
    correct: boolean;
    guessedNumber: number;
    actualNumber: number;
    message: string;
  } | null>(null);
  
  const queryClient = useQueryClient();

  const guessMutation = useMutation({
    mutationFn: gameService.guess,
    onSuccess: async (data) => {
      setLastResult({
        correct: data.correct,
        guessedNumber: data.guessedNumber,
        actualNumber: data.actualNumber,
        message: data.message,
      });

      if (data.correct) {
        toast.success("🎉 Chính xác!", {
          description: `Bạn đoán đúng số ${data.actualNumber}! +${data.scoreEarned} điểm`,
        });
      } else {
        toast.error("😢 Sai rồi!", {
          description: `Số đúng là ${data.actualNumber}. Thử lại nhé!`,
        });
      }

      // Fetch user mới từ API để cập nhật score/turns
      try {
        const updatedUser = await userService.getCurrentUser();
        if (refreshUserData) {
          refreshUserData(updatedUser);
        }
      } catch {
        // Fail silently, user will be updated on next page load
      }

      // Invalidate queries to refresh other data
      queryClient.invalidateQueries({ queryKey: ["current-user"] });
      queryClient.invalidateQueries({ queryKey: ["game-history"] });
      queryClient.invalidateQueries({ queryKey: ["leaderboard"] });
      
      setSelectedNumber(null);
    },
    onError: (error: Error) => {
      toast.error("Lỗi!", {
        description: error.message || "Không thể chơi. Vui lòng thử lại.",
      });
    },
  });

  const handleGuess = () => {
    if (selectedNumber === null) {
      toast.warning("Chưa chọn số!", {
        description: "Vui lòng chọn một số từ 1 đến 5",
      });
      return;
    }

    if (!user || user.turns <= 0) {
      toast.error("Hết lượt chơi!", {
        description: "Bạn cần mua thêm lượt chơi",
      });
      return;
    }

    guessMutation.mutate({ number: selectedNumber });
  };

  return (
    <div className="space-y-6">
      {/* Stats Card */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium">Điểm số</CardTitle>
            <Trophy className="w-4 h-4 text-yellow-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{user?.score || 0}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium">Lượt chơi</CardTitle>
            <Zap className="w-4 h-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{user?.turns || 0}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium">Trạng thái</CardTitle>
            <Sparkles className="w-4 h-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <Badge variant={user && user.turns > 0 ? "default" : "destructive"}>
              {user && user.turns > 0 ? "Sẵn sàng" : "Hết lượt"}
            </Badge>
          </CardContent>
        </Card>
      </div>

      {/* Game Board */}
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">Đoán Số May Mắn</CardTitle>
          <CardDescription>
            Chọn một số từ 1 đến 5. Nếu đoán đúng bạn sẽ nhận được 1 điểm!
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Number Selection */}
          <div className="grid grid-cols-5 gap-4">
            {NUMBERS.map((num) => (
              <Button
                key={num}
                variant={selectedNumber === num ? "default" : "outline"}
                size="lg"
                onClick={() => setSelectedNumber(num)}
                disabled={guessMutation.isPending}
                className="h-20 text-3xl font-bold transition-all hover:scale-105"
              >
                {num}
              </Button>
            ))}
          </div>

          {/* Play Button */}
          <Button
            onClick={handleGuess}
            disabled={guessMutation.isPending || !user || user.turns <= 0}
            className="w-full h-12 text-lg font-semibold"
            size="lg"
          >
            {guessMutation.isPending ? (
              <span className="flex items-center gap-2">
                <span className="animate-spin">⏳</span> Đang xử lý...
              </span>
            ) : (
              "🎲 Chơi ngay!"
            )}
          </Button>

          {/* Last Result */}
          {lastResult && (
            <Card className={lastResult.correct ? "border-green-500 bg-green-50" : "border-red-500 bg-red-50"}>
              <CardContent className="pt-6">
                <div className="text-center space-y-2">
                  <p className="text-2xl font-bold">
                    {lastResult.correct ? "🎉 Chính xác!" : "😢 Sai rồi!"}
                  </p>
                  <p className="text-lg">
                    Bạn đoán: <span className="font-bold">{lastResult.guessedNumber}</span> | 
                    Số đúng: <span className="font-bold">{lastResult.actualNumber}</span>
                  </p>
                  <p className="text-sm text-gray-600">{lastResult.message}</p>
                </div>
              </CardContent>
            </Card>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
