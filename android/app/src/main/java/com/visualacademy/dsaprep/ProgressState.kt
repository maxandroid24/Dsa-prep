package com.visualacademy.dsaprep

import androidx.compose.runtime.getValue
import androidx.compose.runtime.setValue
import androidx.compose.runtime.mutableIntStateOf
import androidx.compose.runtime.mutableStateMapOf
import androidx.compose.runtime.mutableStateOf
import androidx.compose.ui.graphics.vector.ImageVector
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.Home
import androidx.compose.material.icons.filled.List
import androidx.compose.material.icons.filled.PlayArrow
import androidx.compose.material.icons.filled.Book

// Global shared state for mock persistence
object ProgressState {
    var streakCount by mutableIntStateOf(5)
    var syncUsername by mutableStateOf("")
    var isSynced by mutableStateOf(false)
    var solvedProblemCount by mutableIntStateOf(3)
    val solvedProblemIds = mutableStateMapOf<String, Boolean>().apply {
        put("two-sum", true)
        put("valid-palindrome", true)
        put("reverse-linked-list", true)
    }
}

sealed class Screen(val route: String, val title: String, val icon: ImageVector) {
    object Dashboard : Screen("dashboard", "Dashboard", Icons.Default.Home)
    object Topics : Screen("topics", "Topics", Icons.Default.List)
    object Playground : Screen("playground", "Code Sandbox", Icons.Default.PlayArrow)
    object Flashcards : Screen("flashcards", "Cards", Icons.Default.Book)
}
