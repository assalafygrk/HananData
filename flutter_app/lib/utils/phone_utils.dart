class PhoneUtils {
  /// Standardizes Nigerian phone numbers:
  /// - 9019928705 -> 09019928705
  /// - +2349019928705 -> 09019928705
  /// - 2349019928705 -> 09019928705
  /// - 09019928705 -> 09019928705
  static String normalizePhone(String phone) {
    if (phone.isEmpty) return '';
    String clean = phone.replaceAll(RegExp(r'\D'), '');
    if (clean.startsWith('234') && clean.length == 13) {
      clean = '0${clean.substring(3)}';
    } else if (clean.length == 10 && !clean.startsWith('0')) {
      clean = '0$clean';
    }
    return clean;
  }

  /// Returns 0-based index matching kNetworks in app_data.dart:
  /// 0: MTN, 1: Airtel, 2: Glo, 3: 9mobile
  static int? detectNetworkIndex(String phone) {
    final clean = normalizePhone(phone);
    if (clean.length < 4) return null;
    final prefix = clean.substring(0, 4);

    const mtnPrefixes = {'0803', '0806', '0813', '0816', '0810', '0814', '0903', '0906', '0913', '0916', '0703', '0706', '0704'};
    const airtelPrefixes = {'0802', '0808', '0812', '0701', '0708', '0902', '0907', '0901', '0912', '0911'};
    const gloPrefixes = {'0805', '0807', '0811', '0815', '0905', '0915', '0705'};
    const mobile9Prefixes = {'0809', '0817', '0818', '0909', '0908'};

    if (mtnPrefixes.contains(prefix)) return 0; // MTN
    if (airtelPrefixes.contains(prefix)) return 1; // Airtel
    if (gloPrefixes.contains(prefix)) return 2; // Glo
    if (mobile9Prefixes.contains(prefix)) return 3; // 9mobile
    return null;
  }
}
