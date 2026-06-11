package com.visualacademy.dsaprep

import androidx.compose.animation.core.animateFloatAsState
import androidx.compose.animation.core.tween
import androidx.compose.foundation.BorderStroke
import androidx.compose.foundation.background
import androidx.compose.foundation.gestures.detectTapGestures
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.ArrowBack
import androidx.compose.material.icons.filled.PlayArrow
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.graphicsLayer
import androidx.compose.ui.input.pointer.pointerInput
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp

data class Flashcard(
    val front: String,
    val back: String
)

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun FlashcardsScreen() {
    val cards = listOf(
        Flashcard("Two Pointers Convergence", "Maintain double indicators (Left & Right) sliding inwards on sorted bounds. Ideal to calculate target sums inside a linear path reducing runtime from O(N^2) to O(N)."),
        Flashcard("Sliding Window Sweep", "Create dynamic index range boundaries (left, right edge elements) tracking subarrays. Sweeps array once reducing nested O(N^2) loops into standard O(N)."),
        Flashcard("Fast & Slow Pointer", "Also known as Tortoise & Hare algorithm. Ideal for tracking cycles in lists or calculating grid center points with O(N) time and constant O(1) memory space footprint."),
        Flashcard("System Design: Rate Limiter", "Controls traffic bounds. Standard algorithms include Token Bucket, Leaking Bucket, Fixed Window, and Sliding Logs. Backed by Redis memory structures."),
        Flashcard("System Design: Star Schema", "An architectural database query optimizer. Splits transactional events into structured core Fact tables, connected around metadata Dimension columns.")
    )

    var currentIdx by remember { mutableIntStateOf(0) }
    var isFlipped by remember { mutableStateOf(false) }

    // Flip animation angle calculation
    val rotation by animateFloatAsState(
        targetValue = if (isFlipped) 180f else 0f,
        animationSpec = tween(durationMillis = 500)
    )

    val currentCard = cards[currentIdx]

    // Reset flipped state on card index change
    LaunchedEffect(currentIdx) {
        isFlipped = false
    }

    Column(
        modifier = Modifier
            .fillMaxSize()
            .background(CosmicDark)
            .padding(16.dp),
        horizontalAlignment = Alignment.CenterHorizontally,
        verticalArrangement = Arrangement.SpaceBetween
    ) {
        // Card Deck Title
        Column(modifier = Modifier.fillMaxWidth()) {
            Text("Interactive Revision Cards", fontSize = 20.sp, fontWeight = FontWeight.Bold, color = Color.White)
            Text("Revisit critical coding and system design concepts daily to consolidate memory.", fontSize = 11.sp, color = SoftText)
        }

        // Central Flashcard layout
        Box(
            modifier = Modifier
                .fillMaxWidth()
                .weight(1f)
                .padding(vertical = 32.dp),
            contentAlignment = Alignment.Center
        ) {
            Card(
                onClick = { isFlipped = !isFlipped },
                colors = CardDefaults.cardColors(containerColor = CosmicSurface),
                border = BorderStroke(2.dp, if (isFlipped) AccentPurple else AccentBlue),
                shape = RoundedCornerShape(24.dp),
                modifier = Modifier
                    .fillMaxSize()
                    .graphicsLayer {
                        rotationY = rotation
                        cameraDistance = 8 * density
                    }
            ) {
                Column(
                    modifier = Modifier
                        .fillMaxSize()
                        .padding(24.dp),
                    verticalArrangement = Arrangement.Center,
                    horizontalAlignment = Alignment.CenterHorizontally
                ) {
                    // Check rotation bound to render either FRONT or BACK layout text to avoid mirror flipping text
                    if (rotation <= 90f) {
                        // FRONT SIDE
                        Column(
                            horizontalAlignment = Alignment.CenterHorizontally,
                            verticalArrangement = Arrangement.spacedBy(16.dp)
                        ) {
                            Text(
                                text = "CONCEPT QUESTION",
                                color = AccentBlue,
                                fontSize = 10.sp,
                                fontWeight = FontWeight.Bold,
                                letterSpacing = 2.sp
                            )
                            Text(
                                text = currentCard.front,
                                color = Color.White,
                                fontSize = 20.sp,
                                fontWeight = FontWeight.ExtraBold,
                                textAlign = TextAlign.Center,
                                lineHeight = 26.sp
                            )
                            Spacer(modifier = Modifier.height(12.dp))
                            Text(
                                text = "Tap Card to Flip & Show Answer",
                                color = SoftText,
                                fontSize = 10.sp,
                                fontWeight = FontWeight.Bold
                            )
                        }
                    } else {
                        // BACK SIDE (must rotate back 180 degrees so text isn't reversed)
                        Column(
                            modifier = Modifier.graphicsLayer { rotationY = 180f },
                            horizontalAlignment = Alignment.CenterHorizontally,
                            verticalArrangement = Arrangement.spacedBy(12.dp)
                        ) {
                            Text(
                                text = "ALGORITHMIC ANATOMY EXPLANATION",
                                color = AccentPurple,
                                fontSize = 10.sp,
                                fontWeight = FontWeight.Bold,
                                letterSpacing = 1.sp
                            )
                            Text(
                                text = currentCard.back,
                                color = Color.White,
                                fontSize = 14.sp,
                                fontWeight = FontWeight.Medium,
                                textAlign = TextAlign.Center,
                                lineHeight = 20.sp
                            )
                        }
                    }
                }
            }
        }

        // Bottom Deck Controllers
        Row(
            modifier = Modifier.fillMaxWidth(),
            horizontalArrangement = Arrangement.SpaceBetween,
            verticalAlignment = Alignment.CenterVertically
        ) {
            Button(
                onClick = { if (currentIdx > 0) currentIdx-- },
                colors = ButtonDefaults.buttonColors(containerColor = CosmicSurface),
                border = BorderStroke(1.dp, BorderColor),
                shape = RoundedCornerShape(12.dp),
                enabled = currentIdx > 0
            ) {
                Icon(Icons.Default.ArrowBack, "Prev Card", tint = if (currentIdx > 0) AccentBlue else SoftText, modifier = Modifier.size(18.dp))
                Spacer(modifier = Modifier.width(4.dp))
                Text("Previous", color = if (currentIdx > 0) Color.White else SoftText, fontSize = 12.sp)
            }

            Text(
                text = "Card ${currentIdx + 1} of ${cards.size}",
                fontSize = 12.sp,
                fontWeight = FontWeight.Bold,
                color = Color.White
            )

            Button(
                onClick = { if (currentIdx < cards.size - 1) currentIdx++ },
                colors = ButtonDefaults.buttonColors(containerColor = CosmicSurface),
                border = BorderStroke(1.dp, BorderColor),
                shape = RoundedCornerShape(12.dp),
                enabled = currentIdx < cards.size - 1
            ) {
                Text("Next Card", color = if (currentIdx < cards.size - 1) Color.White else SoftText, fontSize = 12.sp)
                Spacer(modifier = Modifier.width(4.dp))
                Icon(Icons.Default.PlayArrow, "Next Card", tint = if (currentIdx < cards.size - 1) AccentBlue else SoftText, modifier = Modifier.size(18.dp))
            }
        }
    }
}
