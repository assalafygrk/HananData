// lib/models/txn_data.dart

class TxnData {
  final String type;
  final String? network;
  final String? networkColor;
  final String? recipient;
  final String? plan;
  final String? provider;
  final String? meterNumber;
  final String? refId;
  final int amount;
  final int fee;
  final int total;
  final String description;

  const TxnData({
    required this.type,
    this.network,
    this.networkColor,
    this.recipient,
    this.plan,
    this.provider,
    this.meterNumber,
    this.refId,
    required this.amount,
    required this.fee,
    required this.total,
    required this.description,
  });

  TxnData copyWith({
    String? type,
    String? network,
    String? networkColor,
    String? recipient,
    String? plan,
    String? provider,
    String? meterNumber,
    String? refId,
    int? amount,
    int? fee,
    int? total,
    String? description,
  }) {
    return TxnData(
      type: type ?? this.type,
      network: network ?? this.network,
      networkColor: networkColor ?? this.networkColor,
      recipient: recipient ?? this.recipient,
      plan: plan ?? this.plan,
      provider: provider ?? this.provider,
      meterNumber: meterNumber ?? this.meterNumber,
      refId: refId ?? this.refId,
      amount: amount ?? this.amount,
      fee: fee ?? this.fee,
      total: total ?? this.total,
      description: description ?? this.description,
    );
  }
}
