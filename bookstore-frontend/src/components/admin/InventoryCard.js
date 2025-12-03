// src/components/admin/InventoryCard.js
import React, { useMemo } from "react";
import {
  Box,
  Typography,
  Card,
  CardContent,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
} from "@mui/material";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip as ChartTooltip,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";

const COLORS = ["#9E9770", "#C9B79B", "#A7B29B", "#E6CFAE", "#4E342E"];

const InventoryCard = ({
  inventoryData = [],
  theme = { brown: "#4E342E", beige: "#D7CCC8", sage: "#9E9770" },
}) => {
  
  const normalized = useMemo(() => {
    if (!Array.isArray(inventoryData)) return [];

    if (
      inventoryData.length > 0 &&
      (inventoryData[0].bookId !== undefined ||
        inventoryData[0].title !== undefined)
    ) {
      return inventoryData.map((it) => ({
        bookId: it.bookId ?? it.id ?? null,
        title: it.title ?? it.name ?? "—",
        category: it.category ?? it.categoryName ?? "—",
        stock: Number(it.stock ?? it.quantity ?? it[3] ?? 0),
      }));
    }

    if (inventoryData.length > 0 && typeof inventoryData[0] === "object") {
      return [
        {
          summaryTotalStock:
            inventoryData[0].summaryTotalStock ??
            inventoryData[0].totalStock ??
            inventoryData[0].total ??
            null,
          summaryLowStock:
            inventoryData[0].summaryLowStock ??
            inventoryData[0].lowStock ??
            inventoryData[0].low ??
            null,
          summaryOutOfStock:
            inventoryData[0].summaryOutOfStock ??
            inventoryData[0].outOfStock ??
            inventoryData[0].out ??
            null,
        },
      ];
    }

    return [];
  }, [inventoryData]);

  const isPerBook = useMemo(
    () =>
      normalized.length > 0 &&
      normalized[0].bookId !== undefined &&
      normalized[0].title !== undefined,
    [normalized]
  );

  const topLowStock = useMemo(() => {
    if (!isPerBook) return [];
    return [...normalized]
      .sort((a, b) => a.stock - b.stock)
      .slice(0, 6)
      .map((it) => ({
        title:
          it.title.length > 22 ? it.title.slice(0, 19) + "..." : it.title,
        stock: it.stock,
      }));
  }, [normalized, isPerBook]);

  if (!normalized || normalized.length === 0) {
    return (
      <Card sx={{ p: 2, backgroundColor: "#f3edda" }}>
        <CardContent>
          <Typography variant="h6" sx={{ color: theme.brown, mb: 1}}>
            Inventory
          </Typography>
          <Typography>No inventory data</Typography>
        </CardContent>
      </Card>
    );
  }

  const summary = !isPerBook ? normalized[0] : null;

  return (
    <Card
      sx={{
        p: 2,
        backgroundColor: "#f3edda",
        minHeight: 360,  // increased height
        minWidth: 500,   // for your grid space
      }}
    >
      <CardContent>
        <Typography variant="h6" sx={{ color: theme.brown, mb: 1, fontSize: "1.5rem" }}>
          Inventory
        </Typography>

        {isPerBook ? (
          <>
            <Typography variant="subtitle1" sx={{ color: theme.brown, mb: 2 }}>
              Top low-stock books
            </Typography>

            <Box sx={{ width: "100%", height: 200 }}> {/* increased height */}
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={topLowStock}>
                  <XAxis dataKey="title" tick={{ fill: theme.brown }} />
                  <YAxis tick={{ fill: theme.brown }} />
                  <ChartTooltip />
                  <Bar dataKey="stock" fill={theme.sage} />
                </BarChart>
              </ResponsiveContainer>
            </Box>

            <Box sx={{ mt: 3 }}>
              <Table size="small">
                <TableHead>
                  <TableRow sx={{ backgroundColor: theme.beige }}>
                    <TableCell>Book</TableCell>
                    <TableCell align="right">Stock</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {topLowStock.map((it, idx) => (
                    <TableRow key={idx}>
                      <TableCell
                        sx={{
                          maxWidth: 260,
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          whiteSpace: "nowrap",
                        }}
                      >
                        {it.title}
                      </TableCell>
                      <TableCell
                        align="right"
                        sx={{
                          fontWeight: "bold",
                          color:
                            it.stock === 0
                              ? "#b71c1c"
                              : it.stock < 5
                              ? "#ff8f00"
                              : theme.brown,
                        }}
                      >
                        {it.stock}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Box>
          </>
        ) : (
          <>
            <Box
              sx={{
                display: "flex",
                gap: 2,
                alignItems: "justify",
              }}
            >
              
              <Box sx={{ flex: 1 }}>
                <Typography
                  variant="h6"
                  sx={{ color: theme.brown, fontSize: "1.2rem" , mb:2}}
                >
                  Summary
                </Typography>
                
                                  
                <Typography sx={{ color: theme.brown, fontSize: "1rem", mb:1.5 }}>
                  Total stock: {" "}
                  <b>
                    {summary?.summaryTotalStock ??
                    summary?.totalStock ??
                    "—"}
                  </b>                  
                </Typography>

                                  
                  <Typography sx={{ color: theme.brown, fontSize: "1rem" , mb :1.5}}>
                    Low stock:{" "}
                    <b>
                      {summary?.summaryLowStock ??
                        summary?.lowStock ??
                        "—"}
                    </b>
                  </Typography>

                                      
                  <Typography sx={{ color: theme.brown, fontSize: "1rem", mb:1.5 }}>
                    Out of stock:{" "}
                    <b>
                      {summary?.summaryOutOfStock ??
                        summary?.outOfStock ??
                        "—"}
                    </b>
                  </Typography>
               
              </Box>

             
              <Box sx={{ width: 300, height: 270 }}> 
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={[
                        {
                          name: "Low",
                          value: Number(
                            summary?.summaryLowStock ??
                              summary?.lowStock ??
                              0
                          ),
                        },
                        {
                          name: "Out",
                          value: Number(
                            summary?.summaryOutOfStock ??
                              summary?.outOfStock ??
                              0
                          ),
                        },
                        {
                          name: "Available",
                          value:
                            (Number(
                              summary?.summaryTotalStock ??
                                summary?.totalStock ??
                                0
                            ) -
                              Number(
                                summary?.summaryLowStock ??
                                  summary?.lowStock ??
                                  0
                              ) -
                              Number(
                                summary?.summaryOutOfStock ??
                                  summary?.outOfStock ??
                                  0
                              )) || 0,
                        },
                      ]}
                      dataKey="value"
                      nameKey="name"
                      innerRadius={45}   // bigger
                      outerRadius={100}   // bigger
                      label={false}
                    >
                      <Cell fill={COLORS[0]} />
                      <Cell fill={COLORS[1]} />
                      <Cell fill={COLORS[2]} />
                    </Pie>
                    <Legend verticalAlign="bottom" height={28} />
                    <ChartTooltip />
                  </PieChart>
                </ResponsiveContainer>
              </Box>
            </Box>
          </>
        )}
      </CardContent>
    </Card>
  );
};

export default InventoryCard;
