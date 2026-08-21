package com.bookmyvendor.admin.dto;

import lombok.Builder;
import lombok.Data;

import java.math.BigDecimal;

@Data
@Builder
public class AdminDashboardStatsDto {
    private long totalCustomers;
    private long totalVendors;
    private long pendingKycCount;
    private long totalBookings;
    private BigDecimal totalRevenue;
}
