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

  /// Cable TV provider detection matching kCableProviders (0: DStv, 1: GOtv, 2: StarTimes)
  static int? detectCableProviderIndex(String smartcard) {
    final clean = smartcard.replaceAll(RegExp(r'\D'), '');
    if (clean.length < 2) return null;

    // StarTimes decoder numbers are 11 digits starting with 01, 02, 06, 07, 0, 2
    if (clean.length == 11 && (clean.startsWith('01') || clean.startsWith('02') || clean.startsWith('06') || clean.startsWith('07'))) {
      return 2; // StarTimes
    }
    // GOtv IUC numbers are 10 digits starting with 20, 70, 10, 2
    if (clean.length == 10 && (clean.startsWith('20') || clean.startsWith('70') || clean.startsWith('2'))) {
      return 1; // GOtv
    }
    // DStv smartcard numbers are 10 or 11 digits starting with 10, 4, 1, 7
    if ((clean.length == 10 || clean.length == 11) && (clean.startsWith('10') || clean.startsWith('4') || clean.startsWith('1'))) {
      return 0; // DStv
    }
    return null;
  }

  /// Electricity Meter detection matching kDiscos indices (0 to 10)
  static int? detectElectricityDiscoIndex(String meter) {
    final clean = meter.replaceAll(RegExp(r'\D'), '');
    if (clean.length < 3) return null;

    // Ikeja Electric (IKEDC) -> 0
    if (clean.startsWith('0101') || clean.startsWith('0102') || clean.startsWith('015') || clean.startsWith('016') || clean.startsWith('017') || clean.startsWith('018') || clean.startsWith('019')) return 0;
    // Eko Electric (EKEDC) -> 1
    if (clean.startsWith('012') || clean.startsWith('013') || clean.startsWith('014') || clean.startsWith('041') || clean.startsWith('042')) return 1;
    // Abuja Electric (AEDC) -> 2
    if (clean.startsWith('14') || clean.startsWith('44') || clean.startsWith('54') || clean.startsWith('010') || clean.startsWith('011')) return 2;
    // Enugu Electric (EEDC) -> 3
    if (clean.startsWith('07') || clean.startsWith('70') || clean.startsWith('08')) return 3;
    // Port Harcourt Electric (PHED) -> 4
    if (clean.startsWith('30') || clean.startsWith('95') || clean.startsWith('96')) return 4;
    // Ibadan Electric (IBEDC) -> 5
    if (clean.startsWith('62') || clean.startsWith('65') || clean.startsWith('66')) return 5;
    // Kano Electric (KEDCO) -> 6
    if (clean.startsWith('37') || clean.startsWith('22') || clean.startsWith('32')) return 6;
    // Jos Electric (JED) -> 7
    if (clean.startsWith('90') || clean.startsWith('91') || clean.startsWith('92')) return 7;
    // Kaduna Electric (KAEDCO) -> 8
    if (clean.startsWith('80') || clean.startsWith('81') || clean.startsWith('82')) return 8;
    // Benin Electric (BEDC) -> 9
    if (clean.startsWith('45') || clean.startsWith('46')) return 9;
    // Yola Electric (YEDC) -> 10
    if (clean.startsWith('40') || clean.startsWith('41')) return 10;

    return null;
  }
}
