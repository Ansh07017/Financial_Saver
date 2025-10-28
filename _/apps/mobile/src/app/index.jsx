import { useState, useEffect } from "react";
import {
  View,
  Text,
  ScrollView,
  Pressable,
  ActivityIndicator,
  StyleSheet,
} from "react-native";
import { StatusBar } from "expo-status-bar";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/utils/auth/useAuth";
import useUser from "@/utils/auth/useUser";
import {
  DollarSign,
  TrendingUp,
  Target,
  Plus,
  Minus,
  BarChart3,
  PieChart,
} from "lucide-react-native";

export default function Index() {
  const insets = useSafeAreaInsets();
  const { signIn, signOut, isReady, isAuthenticated } = useAuth();
  const { data: user, loading: userLoading } = useUser();

  const { data: dashboardData, isLoading } = useQuery({
    queryKey: ["dashboard"],
    queryFn: async () => {
      const response = await fetch("/api/dashboard");
      if (!response.ok) {
        throw new Error("Failed to fetch dashboard data");
      }
      return response.json();
    },
    enabled: isAuthenticated && !!user,
  });

  // Show auth modal if not authenticated
  useEffect(() => {
    if (isReady && !isAuthenticated) {
      signIn();
    }
  }, [isReady, isAuthenticated, signIn]);

  if (!isReady || userLoading) {
    return (
      <View
        style={[styles.container, styles.centered, { paddingTop: insets.top }]}
      >
        <StatusBar style="light" />
        <ActivityIndicator size="large" color="#4F46E5" />
        <Text style={styles.loadingText}>Loading MoneyFlow...</Text>
      </View>
    );
  }

  if (!isAuthenticated || !user) {
    return (
      <View
        style={[styles.container, styles.centered, { paddingTop: insets.top }]}
      >
        <StatusBar style="light" />
        <View style={styles.logoContainer}>
          <Text style={styles.logoText}>$</Text>
        </View>
        <Text style={styles.appTitle}>MoneyFlow</Text>
        <Text style={styles.subtitle}>Loading your financial dashboard...</Text>
      </View>
    );
  }

  if (isLoading) {
    return (
      <View style={[styles.container, { paddingTop: insets.top }]}>
        <StatusBar style="dark" />
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerContent}>
            <View style={styles.headerLeft}>
              <View style={styles.headerLogo}>
                <Text style={styles.headerLogoText}>$</Text>
              </View>
              <Text style={styles.headerTitle}>MoneyFlow</Text>
            </View>
            <Text style={styles.welcomeText}>
              Welcome, {user.name || user.email}
            </Text>
          </View>
        </View>

        <View style={styles.centered}>
          <ActivityIndicator size="large" color="#4F46E5" />
          <Text style={styles.loadingText}>Loading dashboard...</Text>
        </View>
      </View>
    );
  }

  const stats = dashboardData?.stats || {
    totalIncome: 0,
    totalExpenses: 0,
    savings: 0,
    savingsGoalProgress: 0,
  };

  const recentTransactions = dashboardData?.recentTransactions || [];
  const savingsGoals = dashboardData?.savingsGoals || [];

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <StatusBar style="dark" />

      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <View style={styles.headerLeft}>
            <View style={styles.headerLogo}>
              <Text style={styles.headerLogoText}>$</Text>
            </View>
            <Text style={styles.headerTitle}>MoneyFlow</Text>
          </View>
          <Pressable onPress={() => signOut()} style={styles.signOutButton}>
            <Text style={styles.signOutText}>Sign Out</Text>
          </Pressable>
        </View>
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={[
          styles.scrollContent,
          { paddingBottom: insets.bottom + 20 },
        ]}
        showsVerticalScrollIndicator={false}
      >
        {/* Welcome Message */}
        <View style={styles.welcomeContainer}>
          <Text style={styles.welcomeTitle}>
            Welcome back, {user.name || user.email}!
          </Text>
          <Text style={styles.welcomeSubtitle}>
            Here's your financial overview
          </Text>
        </View>

        {/* Stats Cards */}
        <View style={styles.statsContainer}>
          {/* Total Income */}
          <View style={styles.statCard}>
            <View style={styles.statIcon}>
              <DollarSign size={24} color="#10B981" />
            </View>
            <Text style={styles.statLabel}>Total Income</Text>
            <Text style={styles.statValue}>
              ${stats.totalIncome.toFixed(2)}
            </Text>
          </View>

          {/* Total Expenses */}
          <View style={styles.statCard}>
            <View style={[styles.statIcon, { backgroundColor: "#FEE2E2" }]}>
              <Minus size={24} color="#EF4444" />
            </View>
            <Text style={styles.statLabel}>Total Expenses</Text>
            <Text style={styles.statValue}>
              ${stats.totalExpenses.toFixed(2)}
            </Text>
          </View>

          {/* Net Savings */}
          <View style={styles.statCard}>
            <View style={[styles.statIcon, { backgroundColor: "#EDE9FE" }]}>
              <TrendingUp size={24} color="#4F46E5" />
            </View>
            <Text style={styles.statLabel}>Net Savings</Text>
            <Text
              style={[
                styles.statValue,
                { color: stats.savings >= 0 ? "#10B981" : "#EF4444" },
              ]}
            >
              ${stats.savings.toFixed(2)}
            </Text>
          </View>

          {/* Goal Progress */}
          <View style={styles.statCard}>
            <View style={[styles.statIcon, { backgroundColor: "#CFFAFE" }]}>
              <Target size={24} color="#22D3EE" />
            </View>
            <Text style={styles.statLabel}>Goal Progress</Text>
            <Text style={styles.statValue}>{stats.savingsGoalProgress}%</Text>
          </View>
        </View>

        {/* Quick Actions */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Quick Actions</Text>
          <View style={styles.actionsGrid}>
            <Pressable style={styles.actionButton}>
              <View style={[styles.actionIcon, { backgroundColor: "#DCFCE7" }]}>
                <Plus size={20} color="#10B981" />
              </View>
              <Text style={styles.actionText}>Add Income</Text>
            </Pressable>

            <Pressable style={styles.actionButton}>
              <View style={[styles.actionIcon, { backgroundColor: "#FEE2E2" }]}>
                <Minus size={20} color="#EF4444" />
              </View>
              <Text style={styles.actionText}>Add Expense</Text>
            </Pressable>

            <Pressable style={styles.actionButton}>
              <View style={[styles.actionIcon, { backgroundColor: "#CFFAFE" }]}>
                <Target size={20} color="#22D3EE" />
              </View>
              <Text style={styles.actionText}>Set Goal</Text>
            </Pressable>

            <Pressable style={styles.actionButton}>
              <View style={[styles.actionIcon, { backgroundColor: "#EDE9FE" }]}>
                <BarChart3 size={20} color="#4F46E5" />
              </View>
              <Text style={styles.actionText}>View Reports</Text>
            </Pressable>
          </View>
        </View>

        {/* Recent Transactions */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Recent Transactions</Text>
            <Pressable style={styles.addButton}>
              <Text style={styles.addButtonText}>Add</Text>
            </Pressable>
          </View>

          {recentTransactions.length > 0 ? (
            <View style={styles.transactionsList}>
              {recentTransactions.slice(0, 5).map((transaction, index) => (
                <View key={index} style={styles.transactionItem}>
                  <View style={styles.transactionLeft}>
                    <View
                      style={[
                        styles.transactionIcon,
                        {
                          backgroundColor:
                            transaction.type === "income"
                              ? "#DCFCE7"
                              : "#FEE2E2",
                        },
                      ]}
                    >
                      <Text
                        style={[
                          styles.transactionIconText,
                          {
                            color:
                              transaction.type === "income"
                                ? "#10B981"
                                : "#EF4444",
                          },
                        ]}
                      >
                        {transaction.type === "income" ? "+" : "-"}
                      </Text>
                    </View>
                    <View>
                      <Text style={styles.transactionDescription}>
                        {transaction.description}
                      </Text>
                      <Text style={styles.transactionCategory}>
                        {transaction.category}
                      </Text>
                    </View>
                  </View>
                  <View style={styles.transactionRight}>
                    <Text
                      style={[
                        styles.transactionAmount,
                        {
                          color:
                            transaction.type === "income"
                              ? "#10B981"
                              : "#EF4444",
                        },
                      ]}
                    >
                      {transaction.type === "income" ? "+" : "-"}$
                      {transaction.amount.toFixed(2)}
                    </Text>
                    <Text style={styles.transactionDate}>
                      {transaction.date}
                    </Text>
                  </View>
                </View>
              ))}
            </View>
          ) : (
            <View style={styles.emptyState}>
              <PieChart size={48} color="#9CA3AF" />
              <Text style={styles.emptyTitle}>No transactions yet</Text>
              <Text style={styles.emptySubtitle}>
                Get started by adding your first transaction
              </Text>
              <Pressable style={styles.emptyButton}>
                <Text style={styles.emptyButtonText}>
                  Add First Transaction
                </Text>
              </Pressable>
            </View>
          )}
        </View>

        {/* Savings Goals */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Savings Goals</Text>
            <Pressable style={styles.addButton}>
              <Text style={styles.addButtonText}>New</Text>
            </Pressable>
          </View>

          {savingsGoals.length > 0 ? (
            <View style={styles.goalsList}>
              {savingsGoals.slice(0, 3).map((goal, index) => {
                const progress = Math.min(
                  (goal.current_amount / goal.target_amount) * 100,
                  100,
                );
                return (
                  <View key={index} style={styles.goalItem}>
                    <View style={styles.goalHeader}>
                      <Text style={styles.goalTitle}>{goal.title}</Text>
                      <Text style={styles.goalProgress}>
                        {Math.round(progress)}%
                      </Text>
                    </View>
                    <View style={styles.progressBar}>
                      <View
                        style={[styles.progressFill, { width: `${progress}%` }]}
                      />
                    </View>
                    <View style={styles.goalFooter}>
                      <Text style={styles.goalAmount}>
                        ${goal.current_amount.toFixed(2)}
                      </Text>
                      <Text style={styles.goalTarget}>
                        ${goal.target_amount.toFixed(2)}
                      </Text>
                    </View>
                  </View>
                );
              })}
            </View>
          ) : (
            <View style={styles.emptyState}>
              <Target size={48} color="#9CA3AF" />
              <Text style={styles.emptyTitle}>No savings goals</Text>
              <Text style={styles.emptySubtitle}>
                Create your first savings goal to start tracking progress
              </Text>
              <Pressable style={styles.emptyButton}>
                <Text style={styles.emptyButtonText}>Create Goal</Text>
              </Pressable>
            </View>
          )}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F9FAFB",
  },
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: "#6B7280",
  },
  logoContainer: {
    width: 80,
    height: 80,
    borderRadius: 20,
    backgroundColor: "#4F46E5",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 24,
  },
  logoText: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#FFFFFF",
  },
  appTitle: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#111827",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: "#6B7280",
  },
  header: {
    backgroundColor: "#FFFFFF",
    borderBottomWidth: 1,
    borderBottomColor: "#E5E7EB",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  headerContent: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  headerLeft: {
    flexDirection: "row",
    alignItems: "center",
  },
  headerLogo: {
    width: 40,
    height: 40,
    borderRadius: 10,
    backgroundColor: "#4F46E5",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  headerLogoText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#FFFFFF",
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#111827",
  },
  welcomeText: {
    fontSize: 12,
    color: "#6B7280",
  },
  signOutButton: {
    backgroundColor: "#F3F4F6",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  signOutText: {
    fontSize: 12,
    fontWeight: "500",
    color: "#374151",
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingVertical: 24,
  },
  welcomeContainer: {
    marginBottom: 24,
  },
  welcomeTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#111827",
    marginBottom: 4,
  },
  welcomeSubtitle: {
    fontSize: 16,
    color: "#6B7280",
  },
  statsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
    marginBottom: 32,
  },
  statCard: {
    flex: 1,
    minWidth: "47%",
    backgroundColor: "#FFFFFF",
    padding: 16,
    borderRadius: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  statIcon: {
    width: 48,
    height: 48,
    borderRadius: 12,
    backgroundColor: "#DCFCE7",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 12,
  },
  statLabel: {
    fontSize: 12,
    fontWeight: "500",
    color: "#6B7280",
    marginBottom: 4,
  },
  statValue: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#111827",
  },
  section: {
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#111827",
    marginBottom: 16,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  addButton: {
    backgroundColor: "#4F46E5",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  addButtonText: {
    fontSize: 14,
    fontWeight: "500",
    color: "#FFFFFF",
  },
  actionsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
  },
  actionButton: {
    flex: 1,
    minWidth: "47%",
    backgroundColor: "#FFFFFF",
    alignItems: "center",
    padding: 20,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },
  actionIcon: {
    width: 48,
    height: 48,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 12,
  },
  actionText: {
    fontSize: 12,
    fontWeight: "500",
    color: "#111827",
    textAlign: "center",
  },
  transactionsList: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  transactionItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#F3F4F6",
  },
  transactionLeft: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  transactionIcon: {
    width: 40,
    height: 40,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  transactionIconText: {
    fontSize: 16,
    fontWeight: "bold",
  },
  transactionDescription: {
    fontSize: 14,
    fontWeight: "500",
    color: "#111827",
    marginBottom: 2,
  },
  transactionCategory: {
    fontSize: 12,
    color: "#6B7280",
  },
  transactionRight: {
    alignItems: "flex-end",
  },
  transactionAmount: {
    fontSize: 14,
    fontWeight: "600",
    marginBottom: 2,
  },
  transactionDate: {
    fontSize: 12,
    color: "#6B7280",
  },
  goalsList: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  goalItem: {
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#F3F4F6",
  },
  goalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  goalTitle: {
    fontSize: 14,
    fontWeight: "500",
    color: "#111827",
  },
  goalProgress: {
    fontSize: 12,
    color: "#6B7280",
  },
  progressBar: {
    height: 8,
    backgroundColor: "#E5E7EB",
    borderRadius: 4,
    marginBottom: 8,
  },
  progressFill: {
    height: "100%",
    backgroundColor: "#22D3EE",
    borderRadius: 4,
  },
  goalFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  goalAmount: {
    fontSize: 12,
    color: "#6B7280",
  },
  goalTarget: {
    fontSize: 12,
    color: "#6B7280",
  },
  emptyState: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 32,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: "500",
    color: "#111827",
    marginTop: 16,
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 14,
    color: "#6B7280",
    textAlign: "center",
    marginBottom: 16,
  },
  emptyButton: {
    backgroundColor: "#4F46E5",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  emptyButtonText: {
    fontSize: 14,
    fontWeight: "500",
    color: "#FFFFFF",
  },
});
