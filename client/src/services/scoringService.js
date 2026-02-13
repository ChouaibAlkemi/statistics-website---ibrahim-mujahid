export const scoringService = {
  calculate(answers, age) {
    const totalScore = answers.reduce((acc, curr) => acc + (curr || 0), 0);
    
    // Dimension Splits (10 each)
    const dimensions = {
      physical: answers.slice(0, 10).reduce((a, b) => a + b, 0),
      verbal: answers.slice(10, 20).reduce((a, b) => a + b, 0),
      emotional: answers.slice(20, 30).reduce((a, b) => a + b, 0),
      indirect: answers.slice(30, 40).reduce((a, b) => a + b, 0),
      environmental: answers.slice(40, 50).reduce((a, b) => a + b, 0),
    };

    const classification = this.getClassification(totalScore);
    const dimensionAnalysis = this.getDimensionAnalysis(dimensions);
    const ageInterpretation = this.getAgeInterpretation(age, totalScore, classification.level);

    return {
      totalScore,
      age,
      dimensions,
      classification,
      dimensionAnalysis,
      ageInterpretation,
      reportGeneratedAt: new Date().toISOString()
    };
  },

  getClassification(score) {
    if (score <= 50) return { 
        level: 'Very Normal', 
        label: 'عدوانية طبيعية جداً', 
        color: '#22c55e', 
        bg: 'bg-green-50',
        desc: 'يظهر الطفل سلوكيات اجتماعية سليمة وتوافقاً نفسياً جيداً.',
        recs: ['الاستمرار في تعزيز السلوك الإيجابي', 'توفير بيئة داعمة للتعبير عن المشاعر', 'تشجيع العمل الجماعي']
    };
    if (score <= 90) return { 
        level: 'Developmentally Normal', 
        label: 'عدوانية طبيعية لمرحلة النمو', 
        color: '#eab308', 
        bg: 'bg-yellow-50',
        desc: 'السلوكيات تقع ضمن النطاق المتوقع لنمو الطفل وتطور شخصيته.',
        recs: ['توجيه الطفل عند الخطأ بهدوء', 'تعليم مهارات حل المشكلات البسيطة', 'مكافأة السلوك الهادئ']
    };
    if (score <= 130) return { 
        level: 'Moderate', 
        label: 'عدوانية متوسطة (تحتاج تدخل)', 
        color: '#f97316', 
        bg: 'bg-orange-50',
        desc: 'بدأت السلوكيات تؤثر على علاقات الطفل، ويوصى ببرنامج تربوي لتعديل السلوك.',
        recs: ['البدء بجدول تعديل سلوك منزلي', 'تقليل فترات الشاشات والألعاب العنيفة', 'استشارة مرشد تربوي']
    };
    if (score <= 170) return { 
        level: 'High Concerning', 
        label: 'عدوانية مرتفعة وقلقة', 
        color: '#ef4444', 
        bg: 'bg-red-50',
        desc: 'السلوكيات تشكل عائقاً اجتماعياً وتحتاج لمتابعة دقيقة وتدخل مهني.',
        recs: ['استشارة أخصائي نفسي للأطفال', 'البحث عن أسباب الضغوط النفسية للطفل', 'تدريب الطفل على مهارات الاسترخاء']
    };
    return { 
        level: 'Severe', 
        label: 'عدوانية شديدة وحادة', 
        color: '#000000', 
        bg: 'bg-slate-200',
        desc: 'يوجد خطر على الطفل أو من حوله، التدخل المهني الفوري ضروري.',
        recs: ['جلسات علاج سلوكي معرفي مكثفة', 'تقييم شامل للبيئة العائلية والمدرسية', 'تحويل متخصص للتشخيص الإكلينيكي']
    };
  },

  getDimensionAnalysis(dims) {
    const analysis = [];
    const threshold = 28; // 70% of 40

    if (dims.physical >= threshold) analysis.push({ name: 'العدوان الجسدي', desc: 'يحتاج لتدريب على ضبط الاندفاع وتفريغ الطاقة حركياً.' });
    if (dims.verbal >= threshold) analysis.push({ name: 'العدوان اللفظي', desc: 'يحتاج لتحسين مهارات التواصل والتعبير عن الغضب بالكلمات.' });
    if (dims.emotional >= threshold) analysis.push({ name: 'العدوان الانفعالي', desc: 'يحتاج لدعم في تنظيم المشاعر وبناء التعاطف.' });
    if (dims.indirect >= threshold) analysis.push({ name: 'العدوان غير المباشر', desc: 'قد يعاني من ضعف الثقة بالنفس أو الغيرة، يحتاج لرفع تقدير الذات.' });
    if (dims.environmental >= threshold) analysis.push({ name: 'أسباب بيئية وإعلامية', desc: 'يجب تقليل التعرض للشاشات وضبط البيئة المحيطة.' });

    return analysis;
  },

  getAgeInterpretation(age, score, level) {
    if (age >= 2 && age <= 4) {
      return "في هذه المرحلة العمرية (2-4 سنوات)، قد يكون العدوان الجسدي جزءاً من استكشاف الطفل واستقلاليته. التوجيه التربوي البسيط فعال جداً هنا.";
    } else if (age >= 5 && age <= 7) {
      return "من المتوقع في سن (5-7 سنوات) أن يبدأ الطفل باستبدال العدوان الجسدي باللفظي. بقاء العدوان الجسدي مرتفعاً هنا يستدعي الانتباه.";
    } else {
      return "في عمر 8 سنوات وما فوق، يعتبر العدوان الجسدي المستمر مؤشراً يحتاج لتدخل أخصائي لضمان عدم تطور السلوك لعداء مزمن.";
    }
  }
};
