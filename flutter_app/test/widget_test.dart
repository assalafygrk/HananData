// This is a basic Flutter widget test.
import 'package:flutter_test/flutter_test.dart';
import 'package:hanan_data/main.dart';

void main() {
  testWidgets('App smoke test', (WidgetTester tester) async {
    await tester.pumpWidget(const HananDataApp());
    // Smoke test — app renders without crashing
    expect(find.byType(HananDataApp), findsOneWidget);
  });
}
