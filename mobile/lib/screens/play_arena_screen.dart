import 'package:flutter/material.dart';

class PlayArenaScreen extends StatelessWidget {
  const PlayArenaScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: const Color(0xFF121212),
      appBar: AppBar(
        backgroundColor: Colors.transparent,
        elevation: 0,
        title: const Text('Rapid • 10 min'),
        centerTitle: true,
      ),
      body: Column(
        children: [
          // Opponent (Top)
          _buildPlayerProfile(
            name: 'Stockfish 15',
            elo: '3200',
            time: '10:00',
            isTop: true,
          ),

          // Board Area (Center)
          Expanded(
            child: Row(
              children: [
                // Evaluation Bar
                Container(
                  width: 16,
                  margin: const EdgeInsets.only(left: 8, top: 16, bottom: 16),
                  decoration: BoxDecoration(
                    color: const Color(0xFF1E1E1E),
                    borderRadius: BorderRadius.circular(8),
                  ),
                  child: Column(
                    mainAxisAlignment: MainAxisAlignment.end,
                    children: [
                      Container(
                        height: 150, // Simulated eval height
                        decoration: BoxDecoration(
                          color: Colors.white,
                          borderRadius: BorderRadius.circular(8),
                        ),
                      ),
                    ],
                  ),
                ),
                
                // Chess Board
                Expanded(
                  child: AspectRatio(
                    aspectRatio: 1,
                    child: Container(
                      margin: const EdgeInsets.all(16),
                      decoration: BoxDecoration(
                        color: const Color(0xFF4b7399),
                        borderRadius: BorderRadius.circular(8),
                        boxShadow: [
                          BoxShadow(
                            color: const Color(0xFF10B981).withOpacity(0.1),
                            blurRadius: 20,
                            spreadRadius: 5,
                          )
                        ],
                      ),
                      child: const Center(
                        child: Text(
                          'Chessboard Widget Here',
                          style: TextStyle(color: Colors.white54),
                        ),
                      ),
                    ),
                  ),
                ),
              ],
            ),
          ),

          // Player (Bottom)
          _buildPlayerProfile(
            name: 'Guest User',
            elo: '1200',
            time: '09:45',
            isTop: false,
            isWarning: true,
          ),
          
          // Action Buttons
          Padding(
            padding: const EdgeInsets.all(16.0),
            child: Row(
              mainAxisAlignment: MainAxisAlignment.spaceEvenly,
              children: [
                IconButton(
                  onPressed: () {},
                  icon: const Icon(Icons.arrow_back_ios),
                  color: Colors.grey,
                ),
                IconButton(
                  onPressed: () {},
                  icon: const Icon(Icons.flag_outlined),
                  color: Colors.grey,
                ),
                IconButton(
                  onPressed: () {},
                  icon: const Icon(Icons.handshake_outlined),
                  color: Colors.grey,
                ),
                IconButton(
                  onPressed: () {},
                  icon: const Icon(Icons.arrow_forward_ios),
                  color: Colors.grey,
                ),
              ],
            ),
          )
        ],
      ),
    );
  }

  Widget _buildPlayerProfile({
    required String name,
    required String elo,
    required String time,
    required bool isTop,
    bool isWarning = false,
  }) {
    return Padding(
      padding: const EdgeInsets.symmetric(horizontal: 16.0, vertical: 8.0),
      child: Row(
        mainAxisAlignment: MainAxisAlignment.spaceBetween,
        children: [
          Row(
            children: [
              Container(
                width: 48,
                height: 48,
                decoration: BoxDecoration(
                  color: const Color(0xFF1E1E1E),
                  borderRadius: BorderRadius.circular(8),
                ),
              ),
              const SizedBox(width: 12),
              Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    name,
                    style: const TextStyle(
                      color: Colors.white,
                      fontWeight: FontWeight.bold,
                      fontSize: 16,
                    ),
                  ),
                  Text(
                    elo,
                    style: const TextStyle(
                      color: Colors.grey,
                      fontSize: 14,
                    ),
                  ),
                ],
              ),
            ],
          ),
          Container(
            padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
            decoration: BoxDecoration(
              color: isWarning ? const Color(0xFFEF4444).withOpacity(0.2) : const Color(0xFF1E1E1E),
              border: Border.all(
                color: isWarning ? const Color(0xFFEF4444) : Colors.transparent,
                width: 2,
              ),
              borderRadius: BorderRadius.circular(8),
            ),
            child: Text(
              time,
              style: TextStyle(
                color: isWarning ? const Color(0xFFEF4444) : Colors.white,
                fontSize: 24,
                fontWeight: FontWeight.w800,
                fontFamily: 'Outfit',
              ),
            ),
          ),
        ],
      ),
    );
  }
}
