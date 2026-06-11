package com.visualacademy.dsaprep

import androidx.compose.foundation.BorderStroke
import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
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
import kotlinx.coroutines.delay
import kotlinx.coroutines.launch

data class CodeTemplate(
    val title: String,
    val initialCode: String,
    val inputs: String,
    val mockTime: String,
    val mockLogs: List<String>,
    val testSuccess: Boolean
)

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun PlaygroundScreen() {
    val templates = listOf(
        CodeTemplate(
            title = "Two Sum Kotlin",
            initialCode = "fun twoSum(nums: IntArray, target: Int): IntArray {\n" +
                    "    var left = 0\n" +
                    "    var right = nums.size - 1\n" +
                    "    while (left < right) {\n" +
                    "        val sum = nums[left] + nums[right]\n" +
                    "        if (sum == target) return intArrayOf(left, right)\n" +
                    "        else if (sum < target) left++\n" +
                    "        else right--\n" +
                    "    }\n" +
                    "    return intArrayOf()\n" +
                    "}",
            inputs = "nums = [2, 7, 11, 15], target = 9",
            mockTime = "14ms",
            mockLogs = listOf(
                "Running compiler linter configurations...",
                "Scanning Abstract Syntax Tree validation...",
                "Running test suite: testCase_01 - Input: [2,7,11,15], target: 9",
                "Validation Success! Matching expected [0, 1] return indices."
            ),
            testSuccess = true
        ),
        CodeTemplate(
            title = "Valid Palindrome",
            initialCode = "fun isPalindrome(s: String): Boolean {\n" +
                    "    var left = 0\n" +
                    "    var right = s.length - 1\n" +
                    "    while (left < right) {\n" +
                    "        while (left < right && !s[left].isLetterOrDigit()) left++\n" +
                    "        while (left < right && !s[right].isLetterOrDigit()) right--\n" +
                    "        if (s[left].toLowerCase() != s[right].toLowerCase()) return false\n" +
                    "        left++\n" +
                    "        right--\n" +
                    "    }\n" +
                    "    return true\n" +
                    "}",
            inputs = "s = \"A man, a plan, a canal: Panama\"",
            mockTime = "8ms",
            mockLogs = listOf(
                "Sanitizing alphanumeric constraints...",
                "Stepping comparison bounds dynamic sweep...",
                "Running test suite: palindromeTest - Success!",
                "Expected output: true. Received output: true."
            ),
            testSuccess = true
        ),
        CodeTemplate(
            title = "Stack Overflower Helper",
            initialCode = "fun overflow(valItem: Int): Int {\n" +
                    "    // This missing base case helper logs recurrences\n" +
                    "    return overflow(valItem + 1) \n" +
                    "}",
            inputs = "valItem = 0",
            mockTime = "240ms",
            mockLogs = listOf(
                "Executing heap allocations...",
                "WARNING: Deep nesting calls detected. Recursive depth: 2500",
                "COMPILE EXCEPTION: java.lang.StackOverflowError reached memory limit."
            ),
            testSuccess = false
        )
    )

    var selectedTemplate by remember { mutableStateOf(templates[0]) }
    var codeText by remember { mutableStateOf(selectedTemplate.initialCode) }
    var compileStatus by remember { mutableStateOf("Ready") } // "Ready", "Compiling", "Complete"
    val scope = rememberCoroutineScope()

    // Keep code text in sync when template changes
    LaunchedEffect(selectedTemplate) {
        codeText = selectedTemplate.initialCode
        compileStatus = "Ready"
    }

    Column(
        modifier = Modifier
            .fillMaxSize()
            .background(CosmicDark)
            .padding(16.dp),
        verticalArrangement = Arrangement.spacedBy(16.dp)
    ) {
        // Playground Header
        Column {
            Text("Interactive Code Playground", fontSize = 20.sp, fontWeight = FontWeight.Bold, color = Color.White)
            Text("Experiment writing solutions in clean native Kotlin code compiler syntax models.", fontSize = 11.sp, color = SoftText)
        }

        // Templates Selection bar selector
        Row(
            modifier = Modifier.fillMaxWidth(),
            horizontalArrangement = Arrangement.spacedBy(8.dp)
        ) {
            templates.forEach { template ->
                val active = selectedTemplate == template
                Box(
                    modifier = Modifier
                        .weight(1f)
                        .clip(RoundedCornerShape(8.dp))
                        .background(if (active) AccentBlue else CosmicSurface)
                        .clickable { selectedTemplate = template }
                        .padding(vertical = 10.dp, horizontal = 4.dp),
                    contentAlignment = Alignment.Center
                ) {
                    Text(
                        text = template.title,
                        color = if (active) Color.White else SoftText,
                        fontSize = 10.sp,
                        fontWeight = FontWeight.Bold
                    )
                }
            }
        }

        // Main Editor layout block card
        Card(
            colors = CardDefaults.cardColors(containerColor = CosmicSurface),
            border = BorderStroke(1.dp, BorderColor),
            shape = RoundedCornerShape(16.dp),
            modifier = Modifier
                .fillMaxWidth()
                .weight(1f)
        ) {
            Column(
                modifier = Modifier
                    .fillMaxSize()
                    .padding(12.dp)
            ) {
                // Editor panel action controls bar
                Row(
                    modifier = Modifier
                        .fillMaxWidth()
                        .padding(bottom = 8.dp),
                    horizontalArrangement = Arrangement.SpaceBetween,
                    verticalAlignment = Alignment.CenterVertically
                ) {
                    Row(
                        horizontalArrangement = Arrangement.spacedBy(6.dp),
                        verticalAlignment = Alignment.CenterVertically
                    ) {
                        Box(
                            modifier = Modifier
                                .size(8.dp)
                                .background(Color(0xFFEF4444), androidx.compose.foundation.shape.CircleShape)
                        )
                        Box(
                            modifier = Modifier
                                .size(8.dp)
                                .background(Color(0xFFF59E0B), androidx.compose.foundation.shape.CircleShape)
                        )
                        Box(
                            modifier = Modifier
                                .size(8.dp)
                                .background(Color(0xFF10B981), androidx.compose.foundation.shape.CircleShape)
                        )
                        Spacer(modifier = Modifier.width(4.dp))
                        Text(
                            text = "main.kt",
                            color = SoftText,
                            fontSize = 11.sp,
                            fontFamily = FontFamily.Monospace,
                            fontWeight = FontWeight.Bold
                        )
                    }

                    // Run compile Button
                    Button(
                        onClick = {
                            scope.launch {
                                compileStatus = "Compiling"
                                delay(1200)
                                compileStatus = "Complete"
                            }
                        },
                        colors = ButtonDefaults.buttonColors(containerColor = AccentPurple.copy(alpha = 0.2f)),
                        border = BorderStroke(1.dp, AccentPurple),
                        shape = RoundedCornerShape(6.dp),
                        modifier = Modifier.height(34.dp)
                    ) {
                        Icon(
                            imageVector = Icons.Default.PlayArrow,
                            contentDescription = "Compile",
                            tint = AccentPurple,
                            modifier = Modifier.size(16.dp)
                        )
                        Spacer(modifier = Modifier.width(4.dp))
                        Text("Compile Code", color = Color.White, fontSize = 10.sp, fontWeight = FontWeight.Bold)
                    }
                }

                // Interactive Text Editor block
                OutlinedTextField(
                    value = codeText,
                    onValueChange = { codeText = it },
                    modifier = Modifier
                        .fillMaxWidth()
                        .weight(1f)
                        .background(CosmicDark, RoundedCornerShape(8.dp)),
                    colors = OutlinedTextFieldDefaults.colors(
                        focusedBorderColor = BorderColor,
                        unfocusedBorderColor = BorderColor,
                        focusedTextColor = Color.White,
                        unfocusedTextColor = Color.White
                    ),
                    textStyle = LocalTextStyle.current.copy(
                        fontFamily = FontFamily.Monospace,
                        fontSize = 12.sp,
                        lineHeight = 16.sp
                    ),
                    keyboardOptions = KeyboardOptions(imeAction = ImeAction.None)
                )

                Spacer(modifier = Modifier.height(8.dp))

                // Log outputs console window
                Box(
                    modifier = Modifier
                        .fillMaxWidth()
                        .height(130.dp)
                        .background(CosmicDark, RoundedCornerShape(12.dp))
                        .border(1.dp, BorderColor, RoundedCornerShape(12.dp))
                        .padding(12.dp)
                ) {
                    Column(
                        modifier = Modifier.fillMaxSize(),
                        verticalArrangement = Arrangement.spacedBy(4.dp)
                    ) {
                        Text(
                            text = "COMPILER CONSOLE LOGS",
                            fontSize = 9.sp,
                            color = AccentPurple,
                            fontFamily = FontFamily.Monospace,
                            fontWeight = FontWeight.Bold
                        )

                        Spacer(modifier = Modifier.height(2.dp))

                        if (compileStatus == "Compiling") {
                            Row(
                                modifier = Modifier.fillMaxWidth(),
                                verticalAlignment = Alignment.CenterVertically,
                                horizontalArrangement = Arrangement.spacedBy(8.dp)
                            ) {
                                CircularProgressIndicator(
                                    modifier = Modifier.size(14.dp),
                                    color = AccentPurple,
                                    strokeWidth = 2.dp
                                )
                                Text(
                                    text = "Executing syntax linter bounds analysis... Please wait...",
                                    color = SoftText,
                                    fontSize = 11.sp,
                                    fontFamily = FontFamily.Monospace
                                )
                            }
                        } else if (compileStatus == "Ready") {
                            Text(
                                "Console is idle. Press 'Compile Code' above to execute.",
                                color = SoftText,
                                fontSize = 11.sp,
                                fontFamily = FontFamily.Monospace
                            )
                        } else {
                            LazyColumn(
                                modifier = Modifier.fillMaxSize(),
                                verticalArrangement = Arrangement.spacedBy(2.dp)
                            ) {
                                items(selectedTemplate.mockLogs) { logLine ->
                                    Text(
                                        text = logLine,
                                        color = if (logLine.contains("Success") || logLine.contains("Validation")) AccentGreen
                                        else if (logLine.contains("EXCEPTION") || logLine.contains("Error")) AccentRed
                                        else if (logLine.contains("WARNING")) AccentOrange
                                        else Color.White,
                                        fontSize = 10.sp,
                                        fontFamily = FontFamily.Monospace
                                    )
                                }
                                item {
                                    Spacer(modifier = Modifier.height(4.dp))
                                    Row(
                                        modifier = Modifier.fillMaxWidth(),
                                        horizontalArrangement = Arrangement.SpaceBetween
                                    ) {
                                        Text(
                                            text = if (selectedTemplate.testSuccess) "STATUS: SUCCESS" else "STATUS: FAILED",
                                            color = if (selectedTemplate.testSuccess) AccentGreen else AccentRed,
                                            fontWeight = FontWeight.Bold,
                                            fontSize = 11.sp,
                                            fontFamily = FontFamily.Monospace
                                        )
                                        Text(
                                            text = "Runtime: ${selectedTemplate.mockTime}",
                                            color = SoftText,
                                            fontSize = 11.sp,
                                            fontFamily = FontFamily.Monospace
                                        )
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
    }
}
