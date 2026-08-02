import 'package:flutter/material.dart';
import '../services/api_service.dart';
import '../widgets/shared_widgets.dart';

class HelpSupportScreen extends StatefulWidget {
  const HelpSupportScreen({super.key});

  @override
  State<HelpSupportScreen> createState() => _HelpSupportScreenState();
}

class _Message {
  final String text;
  final bool isUser;
  _Message(this.text, this.isUser);
}

class _HelpSupportScreenState extends State<HelpSupportScreen> {
  final TextEditingController _controller = TextEditingController();
  final List<_Message> _messages = [
    _Message("Hello! I'm your HananData assistant. How can I help you today?", false)
  ];
  bool _isLoading = false;

  Future<void> _sendMessage() async {
    final text = _controller.text.trim();
    if (text.isEmpty) return;

    setState(() {
      _messages.add(_Message(text, true));
      _isLoading = true;
    });
    _controller.clear();

    final res = await ApiService.sendChatMessage(text);
    
    if (mounted) {
      setState(() {
        _isLoading = false;
        if (res['success'] == true) {
          _messages.add(_Message(res['data']['reply'] ?? 'Response received.', false));
        } else {
          _messages.add(_Message("Sorry, I'm having trouble connecting right now.", false));
        }
      });
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: Theme.of(context).scaffoldBackgroundColor,
      body: SafeArea(
        child: Column(
          children: [
            BackHeader(title: 'Help & Support', onBack: () => Navigator.pop(context)),
            Expanded(
              child: ListView.builder(
                padding: const EdgeInsets.all(20),
                itemCount: _messages.length,
                itemBuilder: (context, i) {
                  final msg = _messages[i];
                  return Align(
                    alignment: msg.isUser ? Alignment.centerRight : Alignment.centerLeft,
                    child: Container(
                      margin: const EdgeInsets.only(bottom: 16),
                      padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
                      decoration: BoxDecoration(
                        color: msg.isUser ? kPrimaryNavy : Colors.white,
                        borderRadius: BorderRadius.only(
                          topLeft: const Radius.circular(16),
                          topRight: const Radius.circular(16),
                          bottomLeft: Radius.circular(msg.isUser ? 16 : 4),
                          bottomRight: Radius.circular(msg.isUser ? 4 : 16),
                        ),
                        boxShadow: [
                          BoxShadow(
                            color: Colors.black.withOpacity(0.05),
                            blurRadius: 10,
                            offset: const Offset(0, 4),
                          )
                        ]
                      ),
                      constraints: BoxConstraints(maxWidth: MediaQuery.of(context).size.width * 0.75),
                      child: Text(
                        msg.text,
                        style: dFont(size: 14, color: msg.isUser ? Colors.white : kPrimaryDark),
                      ),
                    ),
                  );
                },
              ),
            ),
            if (_isLoading)
              const Padding(
                padding: EdgeInsets.all(8.0),
                child: CircularProgressIndicator(color: kPrimaryNavy),
              ),
            Container(
              padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
              decoration: BoxDecoration(
                color: Colors.white,
                border: Border(top: BorderSide(color: kCardBorder)),
              ),
              child: Row(
                children: [
                  Expanded(
                    child: Container(
                      padding: const EdgeInsets.symmetric(horizontal: 16),
                      decoration: BoxDecoration(
                        color: kBackground,
                        borderRadius: BorderRadius.circular(24),
                      ),
                      child: TextField(
                        controller: _controller,
                        decoration: InputDecoration(
                          hintText: 'Type your message...',
                          hintStyle: dFont(size: 14, color: kMutedText),
                          border: InputBorder.none,
                        ),
                        onSubmitted: (_) => _sendMessage(),
                      ),
                    ),
                  ),
                  const SizedBox(width: 8),
                  GestureDetector(
                    onTap: _isLoading ? null : _sendMessage,
                    child: Container(
                      padding: const EdgeInsets.all(12),
                      decoration: const BoxDecoration(
                        color: kPrimaryNavy,
                        shape: BoxShape.circle,
                      ),
                      child: const Icon(Icons.send_rounded, color: Colors.white, size: 20),
                    ),
                  ),
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }
}
