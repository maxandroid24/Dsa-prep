package com.visualacademy.dsaprep

import android.os.Bundle
import androidx.activity.ComponentActivity
import androidx.activity.compose.setContent
import androidx.compose.foundation.border
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import androidx.navigation.compose.NavHost
import androidx.navigation.compose.composable
import androidx.navigation.compose.rememberNavController

class MainActivity : ComponentActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContent {
            MaterialTheme {
                AppMainView()
            }
        }
    }
}

@Composable
fun AppMainView() {
    val navController = rememberNavController()
    var currentScreen by remember { mutableStateOf<Screen>(Screen.Dashboard) }

    Scaffold(
        bottomBar = {
            NavigationBar(
                containerColor = CosmicSurface,
                modifier = Modifier
                    .border(1.dp, BorderColor, RoundedCornerShape(topStart = 16.dp, topEnd = 16.dp))
                    .clip(RoundedCornerShape(topStart = 16.dp, topEnd = 16.dp))
            ) {
                val screens = listOf(Screen.Dashboard, Screen.Topics, Screen.Playground, Screen.Flashcards)
                screens.forEach { screen ->
                    NavigationBarItem(
                        selected = currentScreen == screen,
                        onClick = {
                            currentScreen = screen
                            navController.navigate(screen.route) {
                                popUpTo(navController.graph.startDestinationId) { saveState = true }
                                launchSingleTop = true
                                restoreState = true
                            }
                        },
                        icon = { Icon(screen.icon, contentDescription = screen.title) },
                        label = { Text(screen.title, fontSize = 10.sp, fontWeight = FontWeight.Bold) },
                        colors = NavigationBarItemDefaults.colors(
                            selectedIconColor = Color.White,
                            selectedTextColor = AccentBlue,
                            unselectedIconColor = SoftText,
                            unselectedTextColor = SoftText,
                            indicatorColor = AccentBlue
                        )
                    )
                }
            }
        },
        containerColor = CosmicDark
    ) { innerPadding ->
        NavHost(
            navController = navController,
            startDestination = Screen.Dashboard.route,
            modifier = Modifier.padding(innerPadding)
        ) {
            composable(Screen.Dashboard.route) { DashboardScreen(navController) }
            composable(Screen.Topics.route) { TopicsScreen() }
            composable(Screen.Playground.route) { PlaygroundScreen() }
            composable(Screen.Flashcards.route) { FlashcardsScreen() }
        }
    }
}
