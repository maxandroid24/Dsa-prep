package com.visualacademy.dsaprep

import android.webkit.WebView
import android.webkit.WebViewClient
import androidx.compose.foundation.BorderStroke
import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
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
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import androidx.compose.ui.viewinterop.AndroidView

data class TopicModel(
    val id: String,
    val title: String,
    val desc: String,
    val youtubeId: String,
    val problems: List<ProblemModel>
)

data class ProblemModel(
    val id: String,
    val title: String,
    val level: String, // "Easy", "Medium", "Hard"
    val externalUrl: String
)

@Composable
fun TopicsScreen() {
    val topics = listOf(
        TopicModel(
            id = "two-pointers",
            title = "Two Pointers Technique",
            desc = "Maintain index references in dynamic bounds to achieve efficient O(N) space/time solutions on lists.",
            youtubeId = "-VF6Xtq4rzY",
            problems = listOf(
                ProblemModel("two-sum", "Two Sum II (Sorted)", "Easy", "https://leetcode.com/problems/two-sum-ii-input-array-is-sorted/"),
                ProblemModel("valid-palindrome", "Valid Palindrome", "Easy", "https://leetcode.com/problems/valid-palindrome/"),
                ProblemModel("three-sum", "3Sum Triplet Finder", "Medium", "https://leetcode.com/problems/3sum/")
            )
        ),
        TopicModel(
            id = "sliding-window",
            title = "Sliding Window",
            desc = "Evaluate dynamic arrays and continuous subsections efficiently in a single sequence execution cycle.",
            youtubeId = "8z_pbyuU_zY",
            problems = listOf(
                ProblemModel("min-sub", "Minimum Size Subarray Sum", "Medium", "https://leetcode.com/problems/minimum-size-subarray-sum/"),
                ProblemModel("longest-sub", "Longest Substring Without Repeating Characters", "Medium", "https://leetcode.com/problems/longest-substring-without-repeating-characters/")
            )
        ),
        TopicModel(
            id = "binary-search",
            title = "Binary Search",
            desc = "Exploit properties of structured sorted dimensions to eliminate half the search options iteratively in logarithmic O(log N) runtime.",
            youtubeId = "s4D15nSBiTo",
            problems = listOf(
                ProblemModel("bin-search", "Standard Binary Search", "Easy", "https://leetcode.com/problems/binary-search/"),
                ProblemModel("search-rotated", "Search in Rotated Sorted Array", "Medium", "https://leetcode.com/problems/search-in-rotated-sorted-array/")
            )
        ),
        TopicModel(
            id = "linked-list",
            title = "Linked Lists",
            desc = "Pointer references linking sequential memory fragments. Master dynamic re-pointing without losing node anchors.",
            youtubeId = "G0_I-ZF0S38",
            problems = listOf(
                ProblemModel("rev-list", "Reverse Linked List", "Easy", "https://leetcode.com/problems/reverse-linked-list/"),
                ProblemModel("list-cycle", "Linked List Cycle Detection", "Easy", "https://leetcode.com/problems/linked-list-cycle/")
            )
        )
    )

    var currentSelectedTopic by remember { mutableStateOf(topics[0]) }
    var activeSubTab by remember { mutableStateOf("lecture") } // "lecture", "visualizer", "problems"

    Column(
        modifier = Modifier
            .fillMaxSize()
            .background(CosmicDark)
    ) {
        // Topic Picker Tab List
        ScrollableTabRow(
            selectedTabIndex = topics.indexOf(currentSelectedTopic),
            containerColor = CosmicSurface,
            contentColor = AccentBlue,
            edgePadding = 16.dp,
            divider = { HorizontalDivider(color = BorderColor) }
        ) {
            topics.forEach { topic ->
                Tab(
                    selected = currentSelectedTopic == topic,
                    onClick = { currentSelectedTopic = topic },
                    text = { Text(topic.title, fontWeight = FontWeight.Bold, fontSize = 12.sp) },
                    selectedContentColor = AccentBlue,
                    unselectedContentColor = SoftText
                )
            }
        }

        Column(
            modifier = Modifier
                .fillMaxSize()
                .padding(16.dp),
            verticalArrangement = Arrangement.spacedBy(16.dp)
        ) {
            // General Info Header
            Column {
                Text(
                    text = currentSelectedTopic.title,
                    fontSize = 18.sp,
                    fontWeight = FontWeight.ExtraBold,
                    color = Color.White
                )
                Text(
                    text = currentSelectedTopic.desc,
                    fontSize = 12.sp,
                    color = SoftText,
                    lineHeight = 16.sp
                )
            }

            // Sub Tab Switches
            Row(
                modifier = Modifier
                    .fillMaxWidth()
                    .background(CosmicSurface, RoundedCornerShape(8.dp))
                    .padding(4.dp),
                horizontalArrangement = Arrangement.spacedBy(4.dp)
            ) {
                val subTabs = listOf(
                    "lecture" to "Video Lesson",
                    "visualizer" to "Visualizer",
                    "problems" to "Problems"
                )
                subTabs.forEach { (key, label) ->
                    Box(
                        modifier = Modifier
                            .weight(1f)
                            .clip(RoundedCornerShape(6.dp))
                            .background(if (activeSubTab == key) AccentBlue else Color.Transparent)
                            .clickable { activeSubTab = key }
                            .padding(vertical = 8.dp),
                        contentAlignment = Alignment.Center
                    ) {
                        Text(
                            text = label,
                            fontSize = 11.sp,
                            fontWeight = FontWeight.Bold,
                            color = if (activeSubTab == key) Color.White else SoftText
                        )
                    }
                }
            }

            // Render Content depending on selected Sub-Tab
            when (activeSubTab) {
                "lecture" -> {
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
                                .padding(16.dp),
                            verticalArrangement = Arrangement.spacedBy(12.dp)
                        ) {
                            Text(
                                text = "YouTube Video Lecture",
                                fontSize = 14.sp,
                                fontWeight = FontWeight.Bold,
                                color = Color.White
                            )

                            // Embedded youtube renderer Client
                            Box(
                                modifier = Modifier
                                    .fillMaxWidth()
                                    .weight(1f)
                                    .clip(RoundedCornerShape(12.dp))
                                    .background(Color.Black)
                            ) {
                                AndroidView(
                                    factory = { ctx ->
                                        WebView(ctx).apply {
                                            webViewClient = WebViewClient()
                                            settings.javaScriptEnabled = true
                                            settings.loadWithOverviewMode = true
                                            settings.useWideViewPort = true
                                            loadUrl("https://www.youtube.com/embed/${currentSelectedTopic.youtubeId}")
                                        }
                                    },
                                    modifier = Modifier.fillMaxSize()
                                )
                            }
                        }
                    }
                }

                "visualizer" -> {
                    TwoPointerInteractiveVisualizer(modifier = Modifier.weight(1f))
                }

                "problems" -> {
                    Card(
                        colors = CardDefaults.cardColors(containerColor = CosmicSurface),
                        border = BorderStroke(1.dp, BorderColor),
                        shape = RoundedCornerShape(16.dp),
                        modifier = Modifier
                            .fillMaxWidth()
                            .weight(1f)
                    ) {
                        Column(modifier = Modifier.padding(16.dp), verticalArrangement = Arrangement.spacedBy(12.dp)) {
                            Text("Topic Target Problem Set", fontSize = 14.sp, fontWeight = FontWeight.Bold, color = Color.White)

                            LazyColumn(verticalArrangement = Arrangement.spacedBy(8.dp)) {
                                items(currentSelectedTopic.problems) { problem ->
                                    val isSolved = ProgressState.solvedProblemIds[problem.id] == true
                                    Row(
                                        modifier = Modifier
                                            .fillMaxWidth()
                                            .background(CosmicDark, RoundedCornerShape(12.dp))
                                            .border(1.dp, BorderColor, RoundedCornerShape(12.dp))
                                            .padding(12.dp),
                                        horizontalArrangement = Arrangement.SpaceBetween,
                                        verticalAlignment = Alignment.CenterVertically
                                    ) {
                                        Column(modifier = Modifier.weight(1f)) {
                                            Row(horizontalArrangement = Arrangement.spacedBy(6.dp), verticalAlignment = Alignment.CenterVertically) {
                                                Text(problem.title, fontSize = 13.sp, fontWeight = FontWeight.Bold, color = Color.White)
                                                Box(
                                                    modifier = Modifier
                                                        .background(
                                                            when (problem.level) {
                                                                "Easy" -> AccentGreen.copy(alpha = 0.2f)
                                                                "Medium" -> AccentOrange.copy(alpha = 0.2f)
                                                                else -> AccentRed.copy(alpha = 0.2f)
                                                            },
                                                            RoundedCornerShape(8.dp)
                                                        )
                                                        .padding(horizontal = 6.dp, vertical = 2.dp)
                                                ) {
                                                    Text(
                                                        text = problem.level,
                                                        color = when (problem.level) {
                                                            "Easy" -> AccentGreen
                                                            "Medium" -> AccentOrange
                                                            else -> AccentRed
                                                        },
                                                        fontSize = 8.sp,
                                                        fontWeight = FontWeight.Bold
                                                    )
                                                }
                                            }
                                            Text("Practice now to master core algorithmic flow", fontSize = 10.sp, color = SoftText)
                                        }

                                        Row(
                                            horizontalArrangement = Arrangement.spacedBy(8.dp),
                                            verticalAlignment = Alignment.CenterVertically
                                        ) {
                                            IconButton(
                                                onClick = {
                                                    val nextState = !isSolved
                                                    ProgressState.solvedProblemIds[problem.id] = nextState
                                                    if (nextState) ProgressState.solvedProblemCount++ else ProgressState.solvedProblemCount--
                                                },
                                                modifier = Modifier.size(32.dp)
                                            ) {
                                                Icon(
                                                    imageVector = if (isSolved) Icons.Default.Check else Icons.Default.Add,
                                                    contentDescription = "Toggle Solved Checkbox",
                                                    tint = if (isSolved) AccentGreen else SoftText,
                                                    modifier = Modifier.size(18.dp)
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
    }
}

@Composable
fun TwoPointerInteractiveVisualizer(modifier: Modifier = Modifier) {
    val items = listOf(1, 2, 4, 5, 8)
    val target = 7
    var stepIndex by remember { mutableIntStateOf(0) }

    // Step state list: (Left pointer index, Right pointer index, Status summary text)
    val steps = listOf(
        Triple(0, 4, "L is at index 0 (val 1). R is at index 4 (val 8).\nSum is 1 + 8 = 9. Since 9 > target (7), we must move R inwards to decrement sum."),
        Triple(0, 3, "L is at index 0 (val 1). R is at index 3 (val 5).\nSum is 1 + 5 = 6. Since 6 < target (7), we need a larger sum, so we increment L."),
        Triple(1, 3, "L is at index 1 (val 2). R is at index 3 (val 5).\nSum is 2 + 5 = 7. Sum matches our target! Array solution values returned [2, 5].")
    )

    val currentStep = steps[stepIndex]
    val leftPointer = currentStep.first
    val rightPointer = currentStep.second
    val description = currentStep.third

    Card(
        colors = CardDefaults.cardColors(containerColor = CosmicSurface),
        border = BorderStroke(1.dp, BorderColor),
        shape = RoundedCornerShape(16.dp),
        modifier = modifier.fillMaxWidth()
    ) {
        Column(
            modifier = Modifier
                .fillMaxSize()
                .padding(16.dp),
            verticalArrangement = Arrangement.SpaceBetween
        ) {
            Column(verticalArrangement = Arrangement.spacedBy(10.dp)) {
                Text(
                    text = "Interactive Pointer Stepper",
                    fontSize = 14.sp,
                    fontWeight = FontWeight.Bold,
                    color = Color.White
                )
                Text(
                    text = "Objective: Find a target sum ($target) inside the sorted list of numbers using two pointer bounds convergence.",
                    fontSize = 11.sp,
                    color = SoftText
                )

                // Visual Render Array
                Row(
                    modifier = Modifier
                        .fillMaxWidth()
                        .padding(vertical = 12.dp),
                    horizontalArrangement = Arrangement.SpaceEvenly,
                    verticalAlignment = Alignment.CenterVertically
                ) {
                    items.forEachIndexed { idx, valItem ->
                        val isLeft = idx == leftPointer
                        val isRight = idx == rightPointer
                        val highlight = isLeft || isRight

                        Column(horizontalAlignment = Alignment.CenterHorizontally) {
                            // Pointers L / R Headers
                            Box(modifier = Modifier.height(20.dp)) {
                                if (isLeft && isRight) {
                                    Text("L,R", color = AccentPurple, fontSize = 10.sp, fontWeight = FontWeight.Bold)
                                } else if (isLeft) {
                                    Text("L", color = AccentBlue, fontSize = 10.sp, fontWeight = FontWeight.Bold)
                                } else if (isRight) {
                                    Text("R", color = AccentOrange, fontSize = 10.sp, fontWeight = FontWeight.Bold)
                                }
                            }

                            Spacer(modifier = Modifier.height(4.dp))

                            // Element Block Circle
                            Box(
                                modifier = Modifier
                                    .size(46.dp)
                                    .background(
                                        if (highlight) {
                                            if (isLeft && isRight) AccentPurple.copy(alpha = 0.2f)
                                            else if (isLeft) AccentBlue.copy(alpha = 0.2f)
                                            else AccentOrange.copy(alpha = 0.2f)
                                        } else CosmicCard,
                                        RoundedCornerShape(8.dp)
                                    )
                                    .border(
                                        2.dp,
                                        if (highlight) {
                                            if (isLeft && isRight) AccentPurple
                                            else if (isLeft) AccentBlue
                                            else AccentOrange
                                        } else BorderColor,
                                        RoundedCornerShape(8.dp)
                                    ),
                                contentAlignment = Alignment.Center
                            ) {
                                Text(
                                    text = "$valItem",
                                    color = Color.White,
                                    fontSize = 15.sp,
                                    fontWeight = FontWeight.ExtraBold
                                )
                            }
                            Spacer(modifier = Modifier.height(4.dp))
                            Text("id $idx", color = SoftText, fontSize = 8.sp)
                        }
                    }
                }

                // Description Box Explanations
                Box(
                    modifier = Modifier
                        .fillMaxWidth()
                        .background(CosmicDark, RoundedCornerShape(12.dp))
                        .border(1.dp, BorderColor, RoundedCornerShape(12.dp))
                        .padding(12.dp)
                ) {
                    Column(verticalArrangement = Arrangement.spacedBy(4.dp)) {
                        Text("SIMULATED LOG:", color = AccentBlue, fontSize = 9.sp, fontWeight = FontWeight.ExtraBold, fontFamily = FontFamily.Monospace)
                        Text(
                            text = description,
                            color = Color.White,
                            fontSize = 11.sp,
                            lineHeight = 15.sp,
                            fontFamily = FontFamily.SansSerif
                        )
                    }
                }
            }

            // Stepper Navigation Control Deck
            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.SpaceBetween,
                verticalAlignment = Alignment.CenterVertically
            ) {
                Button(
                    onClick = { if (stepIndex > 0) stepIndex-- },
                    colors = ButtonDefaults.buttonColors(containerColor = CosmicCard),
                    border = BorderStroke(1.dp, BorderColor),
                    shape = RoundedCornerShape(8.dp),
                    enabled = stepIndex > 0
                ) {
                    Icon(Icons.Default.ArrowBack, "Prev Step", tint = if (stepIndex > 0) AccentBlue else SoftText, modifier = Modifier.size(16.dp))
                    Spacer(modifier = Modifier.width(4.dp))
                    Text("Previous", color = if (stepIndex > 0) Color.White else SoftText, fontSize = 11.sp)
                }

                Text(
                    text = "Step ${stepIndex + 1} of 3",
                    fontSize = 12.sp,
                    color = Color.White,
                    fontWeight = FontWeight.Bold
                )

                Button(
                    onClick = { if (stepIndex < 2) stepIndex++ },
                    colors = ButtonDefaults.buttonColors(containerColor = CosmicCard),
                    border = BorderStroke(1.dp, BorderColor),
                    shape = RoundedCornerShape(8.dp),
                    enabled = stepIndex < 2
                ) {
                    Text("Next Step", color = if (stepIndex < 2) Color.White else SoftText, fontSize = 11.sp)
                    Spacer(modifier = Modifier.width(4.dp))
                    Icon(Icons.Default.PlayArrow, "Next Step", tint = if (stepIndex < 2) AccentBlue else SoftText, modifier = Modifier.size(16.dp))
                }
            }
        }
    }
}
