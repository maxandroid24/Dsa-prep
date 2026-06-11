package com.visualacademy.dsaprep

import androidx.compose.foundation.BorderStroke
import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.foundation.text.KeyboardActions
import androidx.compose.foundation.text.KeyboardOptions
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.*
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontFamily
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.input.ImeAction
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import androidx.navigation.NavHostController
import kotlinx.coroutines.delay
import kotlinx.coroutines.launch

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun DashboardScreen(navController: NavHostController) {
    val scope = rememberCoroutineScope()
    var usernameInput by remember { mutableStateOf(ProgressState.syncUsername) }
    var syncLoading by remember { mutableStateOf(false) }

    LazyColumn(
        modifier = Modifier
            .fillMaxSize()
            .background(CosmicDark)
            .padding(16.dp),
        verticalArrangement = Arrangement.spacedBy(16.dp)
    ) {
        item {
            // Dashboard Header
            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.SpaceBetween,
                verticalAlignment = Alignment.CenterVertically
            ) {
                Column {
                    Text(
                        text = "DSA Native Hub",
                        fontSize = 24.sp,
                        fontWeight = FontWeight.ExtraBold,
                        color = Color.White,
                        fontFamily = FontFamily.SansSerif
                    )
                    Text(
                        text = "Your Mobile SDE Coding Companion",
                        fontSize = 12.sp,
                        color = SoftText
                    )
                }
                Box(
                    modifier = Modifier
                        .size(40.dp)
                        .background(AccentBlue.copy(alpha = 0.2f), CircleShape)
                        .border(1.dp, AccentBlue, CircleShape),
                    contentAlignment = Alignment.Center
                ) {
                    Icon(
                        imageVector = Icons.Default.Settings,
                        contentDescription = "Profile Settings",
                        tint = AccentBlue,
                        modifier = Modifier.size(20.dp)
                    )
                }
            }
        }

        // LeetCode Handle Verification Block
        item {
            Card(
                colors = CardDefaults.cardColors(containerColor = CosmicSurface),
                border = BorderStroke(1.dp, BorderColor),
                shape = RoundedCornerShape(16.dp),
                modifier = Modifier.fillMaxWidth()
            ) {
                Column(modifier = Modifier.padding(16.dp), verticalArrangement = Arrangement.spacedBy(8.dp)) {
                    Text(
                        text = "LeetCode Sync Engine",
                        fontSize = 14.sp,
                        fontWeight = FontWeight.Bold,
                        color = Color.White
                    )
                    Text(
                        text = "Enter your LeetCode username to sync solved submissions directly with this local app.",
                        fontSize = 11.sp,
                        color = SoftText
                    )

                    if (ProgressState.isSynced) {
                        Row(
                            modifier = Modifier
                                .fillMaxWidth()
                                .background(AccentGreen.copy(alpha = 0.1f), RoundedCornerShape(8.dp))
                                .border(1.dp, AccentGreen.copy(alpha = 0.3f), RoundedCornerShape(8.dp))
                                .padding(12.dp),
                            verticalAlignment = Alignment.CenterVertically,
                            horizontalArrangement = Arrangement.SpaceBetween
                        ) {
                            Row(
                                verticalAlignment = Alignment.CenterVertically,
                                horizontalArrangement = Arrangement.spacedBy(8.dp)
                            ) {
                                Box(
                                    modifier = Modifier
                                        .size(24.dp)
                                        .background(AccentGreen, CircleShape),
                                    contentAlignment = Alignment.Center
                                ) {
                                    Icon(Icons.Default.Check, "Checked", tint = Color.White, modifier = Modifier.size(14.dp))
                                }
                                Text(
                                    text = "@${ProgressState.syncUsername}",
                                    color = Color.White,
                                    fontSize = 13.sp,
                                    fontWeight = FontWeight.Bold,
                                    fontFamily = FontFamily.Monospace
                                )
                            }
                            Text(
                                text = "Synced: ${ProgressState.solvedProblemCount} problems",
                                color = AccentGreen,
                                fontSize = 11.sp,
                                fontWeight = FontWeight.Bold
                            )
                        }
                    } else {
                        Row(
                            modifier = Modifier.fillMaxWidth(),
                            verticalAlignment = Alignment.CenterVertically,
                            horizontalArrangement = Arrangement.spacedBy(8.dp)
                        ) {
                            OutlinedTextField(
                                value = usernameInput,
                                onValueChange = { usernameInput = it },
                                placeholder = { Text("LeetCode Username", fontSize = 12.sp, color = SoftText) },
                                singleLine = true,
                                modifier = Modifier
                                    .weight(1f)
                                    .height(52.dp),
                                colors = OutlinedTextFieldDefaults.colors(
                                    focusedBorderColor = AccentBlue,
                                    unfocusedBorderColor = BorderColor,
                                    focusedTextColor = Color.White,
                                    unfocusedTextColor = Color.White
                                ),
                                textStyle = LocalTextStyle.current.copy(fontSize = 13.sp, fontFamily = FontFamily.Monospace),
                                keyboardOptions = KeyboardOptions(imeAction = ImeAction.Done),
                                keyboardActions = KeyboardActions(onDone = {
                                    if (usernameInput.isNotBlank()) {
                                        scope.launch {
                                            syncLoading = true
                                            delay(1000)
                                            ProgressState.syncUsername = usernameInput
                                            ProgressState.isSynced = true
                                            ProgressState.solvedProblemCount += 2
                                            syncLoading = false
                                        }
                                    }
                                })
                            )
                            Button(
                                onClick = {
                                    if (usernameInput.isNotBlank()) {
                                        scope.launch {
                                            syncLoading = true
                                            delay(1000)
                                            ProgressState.syncUsername = usernameInput
                                            ProgressState.isSynced = true
                                            ProgressState.solvedProblemCount += 2
                                            syncLoading = false
                                        }
                                    }
                                },
                                colors = ButtonDefaults.buttonColors(containerColor = AccentBlue),
                                modifier = Modifier.height(52.dp),
                                shape = RoundedCornerShape(8.dp)
                            ) {
                                if (syncLoading) {
                                    CircularProgressIndicator(modifier = Modifier.size(18.dp), color = Color.White, strokeWidth = 2.dp)
                                } else {
                                    Text("Sync", fontSize = 12.sp, fontWeight = FontWeight.Bold)
                                }
                            }
                        }
                    }
                }
            }
        }

        // Metrics Deck (Streak & Mastered Topics Layout)
        item {
            Row(modifier = Modifier.fillMaxWidth(), horizontalArrangement = Arrangement.spacedBy(12.dp)) {
                // Streak Card
                Card(
                    modifier = Modifier.weight(1f),
                    colors = CardDefaults.cardColors(containerColor = CosmicSurface),
                    border = BorderStroke(1.dp, BorderColor),
                    shape = RoundedCornerShape(16.dp)
                ) {
                    Column(
                        modifier = Modifier.padding(16.dp),
                        verticalArrangement = Arrangement.spacedBy(6.dp)
                    ) {
                        Row(verticalAlignment = Alignment.CenterVertically, horizontalArrangement = Arrangement.spacedBy(6.dp)) {
                            Box(
                                modifier = Modifier
                                    .size(20.dp)
                                    .background(AccentOrange.copy(alpha = 0.2f), CircleShape),
                                contentAlignment = Alignment.Center
                            ) {
                                Icon(Icons.Default.Favorite, "Streak", tint = AccentOrange, modifier = Modifier.size(12.dp))
                            }
                            Text("Fast Streak", fontSize = 11.sp, color = SoftText, fontWeight = FontWeight.Bold)
                        }

                        Row(verticalAlignment = Alignment.Bottom) {
                            Text(
                                text = "${ProgressState.streakCount}",
                                fontSize = 28.sp,
                                fontWeight = FontWeight.Black,
                                color = Color.White
                            )
                            Text(
                                text = " Days",
                                fontSize = 12.sp,
                                fontWeight = FontWeight.Bold,
                                color = AccentOrange,
                                modifier = Modifier.padding(bottom = 4.dp, start = 2.dp)
                            )
                        }

                        // Weekly streak dots
                        Row(
                            horizontalArrangement = Arrangement.spacedBy(4.dp),
                            modifier = Modifier.padding(top = 4.dp)
                        ) {
                            val daysList = listOf("M", "T", "W", "T", "F", "S", "S")
                            daysList.forEachIndexed { idx, day ->
                                val active = idx < ProgressState.streakCount
                                Box(
                                    modifier = Modifier
                                        .size(16.dp)
                                        .background(if (active) AccentOrange else BorderColor, CircleShape),
                                    contentAlignment = Alignment.Center
                                ) {
                                    Text(
                                        text = day,
                                        fontSize = 8.sp,
                                        fontWeight = FontWeight.Bold,
                                        color = if (active) Color.White else SoftText
                                    )
                                }
                            }
                        }
                    }
                }

                // Mastery Card
                Card(
                    modifier = Modifier.weight(1f),
                    colors = CardDefaults.cardColors(containerColor = CosmicSurface),
                    border = BorderStroke(1.dp, BorderColor),
                    shape = RoundedCornerShape(16.dp)
                ) {
                    Column(
                        modifier = Modifier.padding(16.dp),
                        verticalArrangement = Arrangement.spacedBy(6.dp)
                    ) {
                        Row(verticalAlignment = Alignment.CenterVertically, horizontalArrangement = Arrangement.spacedBy(6.dp)) {
                            Box(
                                modifier = Modifier
                                    .size(20.dp)
                                    .background(AccentPurple.copy(alpha = 0.2f), CircleShape),
                                contentAlignment = Alignment.Center
                            ) {
                                Icon(Icons.Default.Star, "Mastery", tint = AccentPurple, modifier = Modifier.size(12.dp))
                            }
                            Text("Total Completed", fontSize = 11.sp, color = SoftText, fontWeight = FontWeight.Bold)
                        }

                        Row(verticalAlignment = Alignment.Bottom) {
                            Text(
                                text = "${ProgressState.solvedProblemCount}",
                                fontSize = 28.sp,
                                fontWeight = FontWeight.Black,
                                color = Color.White
                            )
                            Text(
                                text = "/35",
                                fontSize = 14.sp,
                                fontWeight = FontWeight.Bold,
                                color = SoftText,
                                modifier = Modifier.padding(bottom = 4.dp)
                            )
                        }

                        Text(
                            text = "Next Target: Sliding Window",
                            fontSize = 8.sp,
                            color = AccentPurple,
                            fontWeight = FontWeight.ExtraBold
                        )
                    }
                }
            }
        }

        // Selected Schedules Block
        item {
            Text(
                text = "My Study Schedules",
                fontSize = 15.sp,
                color = Color.White,
                fontWeight = FontWeight.Bold,
                modifier = Modifier.padding(top = 8.dp)
            )
        }

        item {
            Card(
                colors = CardDefaults.cardColors(containerColor = CosmicSurface),
                border = BorderStroke(1.dp, BorderColor),
                shape = RoundedCornerShape(16.dp),
                modifier = Modifier.fillMaxWidth()
            ) {
                Column(modifier = Modifier.padding(16.dp), verticalArrangement = Arrangement.spacedBy(12.dp)) {
                    Row(
                        modifier = Modifier.fillMaxWidth(),
                        horizontalArrangement = Arrangement.SpaceBetween,
                        verticalAlignment = Alignment.CenterVertically
                    ) {
                        Row(horizontalArrangement = Arrangement.spacedBy(8.dp), verticalAlignment = Alignment.CenterVertically) {
                            Box(
                                modifier = Modifier
                                    .size(36.dp)
                                    .background(AccentBlue.copy(alpha = 0.15f), RoundedCornerShape(8.dp)),
                                contentAlignment = Alignment.Center
                            ) {
                                Icon(Icons.Default.List, "SDE", tint = AccentBlue)
                            }
                            Column {
                                Text("30-Day SDE Schedule", fontSize = 13.sp, fontWeight = FontWeight.Bold, color = Color.White)
                                Text("Premium guided learning path", fontSize = 10.sp, color = SoftText)
                            }
                        }
                        Box(
                            modifier = Modifier
                                .background(AccentBlue.copy(alpha = 0.2f), RoundedCornerShape(12.dp))
                                .padding(horizontal = 8.dp, vertical = 4.dp)
                        ) {
                            Text("Active Path", color = AccentBlue, fontSize = 9.sp, fontWeight = FontWeight.Bold)
                        }
                    }

                    LinearProgressIndicator(
                        progress = 0.25f,
                        color = AccentBlue,
                        trackColor = BorderColor,
                        modifier = Modifier
                            .fillMaxWidth()
                            .height(6.dp)
                            .clip(CircleShape)
                    )

                    Row(
                        modifier = Modifier.fillMaxWidth(),
                        horizontalArrangement = Arrangement.SpaceBetween,
                        verticalAlignment = Alignment.CenterVertically
                    ) {
                        Text("3 of 15 key patterns finished", fontSize = 11.sp, color = SoftText)
                        Text("20% Done", fontSize = 11.sp, color = AccentBlue, fontWeight = FontWeight.Bold)
                    }
                }
            }
        }

        item {
            Card(
                colors = CardDefaults.cardColors(containerColor = CosmicSurface),
                border = BorderStroke(1.dp, BorderColor),
                shape = RoundedCornerShape(16.dp),
                modifier = Modifier.fillMaxWidth()
            ) {
                Column(modifier = Modifier.padding(16.dp), verticalArrangement = Arrangement.spacedBy(12.dp)) {
                    Row(
                        modifier = Modifier.fillMaxWidth(),
                        horizontalArrangement = Arrangement.SpaceBetween,
                        verticalAlignment = Alignment.CenterVertically
                    ) {
                        Row(horizontalArrangement = Arrangement.spacedBy(8.dp), verticalAlignment = Alignment.CenterVertically) {
                            Box(
                                modifier = Modifier
                                    .size(36.dp)
                                    .background(AccentPurple.copy(alpha = 0.15f), RoundedCornerShape(8.dp)),
                                contentAlignment = Alignment.Center
                            ) {
                                Icon(Icons.Default.PlayArrow, "Fast Track", tint = AccentPurple)
                            }
                            Column {
                                Text("14-Day Fast Track", fontSize = 13.sp, fontWeight = FontWeight.Bold, color = Color.White)
                                Text("Core technical revision", fontSize = 10.sp, color = SoftText)
                            }
                        }
                        Box(
                            modifier = Modifier
                                .background(BorderColor, RoundedCornerShape(12.dp))
                                .padding(horizontal = 8.dp, vertical = 4.dp)
                        ) {
                            Text("Start", color = SoftText, fontSize = 9.sp, fontWeight = FontWeight.Bold)
                        }
                    }
                    LinearProgressIndicator(
                        progress = 0f,
                        color = AccentPurple,
                        trackColor = BorderColor,
                        modifier = Modifier
                            .fillMaxWidth()
                            .height(6.dp)
                            .clip(CircleShape)
                    )
                }
            }
        }
    }
}
