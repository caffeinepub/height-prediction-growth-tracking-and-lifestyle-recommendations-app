interface RecommendationItem {
  title: string;
  content: string;
}

interface Recommendations {
  diet: RecommendationItem[];
  exercise: RecommendationItem[];
}

export function getRecommendations(age: number, isMale: boolean): Recommendations {
  const ageGroup = age < 13 ? 'child' : age < 18 ? 'teen' : 'adult';

  const dietRecommendations: Record<string, RecommendationItem[]> = {
    child: [
      {
        title: 'Balanced Nutrition',
        content: 'Focus on a variety of whole foods including fruits, vegetables, whole grains, lean proteins, and dairy. Aim for 3 meals and 2-3 healthy snacks per day.',
      },
      {
        title: 'Protein for Growth',
        content: 'Include protein-rich foods like eggs, chicken, fish, beans, and dairy products. Growing children need adequate protein for bone and muscle development.',
      },
      {
        title: 'Calcium & Vitamin D',
        content: 'Ensure adequate calcium intake through milk, yogurt, cheese, and fortified foods. Vitamin D helps calcium absorption and bone growth.',
      },
      {
        title: 'Hydration',
        content: 'Drink plenty of water throughout the day. Limit sugary drinks and sodas which can interfere with nutrient absorption.',
      },
    ],
    teen: [
      {
        title: 'Increased Caloric Needs',
        content: 'Teenagers need more calories to support rapid growth. Focus on nutrient-dense foods rather than empty calories from junk food.',
      },
      {
        title: 'Protein & Iron',
        content: 'Adequate protein (lean meats, fish, eggs, legumes) and iron (red meat, spinach, fortified cereals) are crucial during growth spurts.',
      },
      {
        title: 'Bone Health',
        content: 'Continue emphasizing calcium and vitamin D through dairy, fortified plant milks, and safe sun exposure. Peak bone mass is built during teen years.',
      },
      {
        title: 'Healthy Eating Patterns',
        content: 'Establish regular meal times, avoid skipping breakfast, and limit processed foods. Good habits now support lifelong health.',
      },
    ],
    adult: [
      {
        title: 'Maintain Bone Health',
        content: 'While height growth has stopped, continue consuming calcium and vitamin D to maintain bone density and prevent osteoporosis.',
      },
      {
        title: 'Balanced Diet',
        content: 'Focus on whole foods, lean proteins, healthy fats, and plenty of fruits and vegetables to maintain overall health.',
      },
      {
        title: 'Weight Management',
        content: 'Maintain a healthy weight through balanced nutrition. Excess weight can affect posture and perceived height.',
      },
      {
        title: 'Hydration & Nutrients',
        content: 'Stay well-hydrated and ensure adequate intake of all essential vitamins and minerals for optimal health.',
      },
    ],
  };

  const exerciseRecommendations: Record<string, RecommendationItem[]> = {
    child: [
      {
        title: 'Active Play',
        content: 'Aim for at least 60 minutes of physical activity daily through play, sports, and active games. This supports healthy bone and muscle development.',
      },
      {
        title: 'Stretching & Flexibility',
        content: 'Include stretching exercises and activities like swimming, gymnastics, or yoga to promote flexibility and good posture.',
      },
      {
        title: 'Weight-Bearing Activities',
        content: 'Running, jumping, and climbing help build strong bones. These activities stimulate bone growth during critical development years.',
      },
      {
        title: 'Sleep & Rest',
        content: 'Ensure 9-11 hours of quality sleep per night. Growth hormone is primarily released during deep sleep.',
      },
    ],
    teen: [
      {
        title: 'Regular Exercise',
        content: 'Maintain at least 60 minutes of moderate to vigorous physical activity daily. Include a mix of aerobic, strength, and flexibility exercises.',
      },
      {
        title: 'Sports & Activities',
        content: 'Participate in sports like basketball, volleyball, swimming, or track. These activities promote bone density and overall fitness.',
      },
      {
        title: 'Strength Training',
        content: 'Light resistance training with proper form can support muscle development. Always use appropriate weights and supervision.',
      },
      {
        title: 'Adequate Sleep',
        content: 'Get 8-10 hours of sleep per night. Growth spurts occur during sleep, making rest crucial for height development.',
      },
    ],
    adult: [
      {
        title: 'Regular Exercise',
        content: 'Maintain 150 minutes of moderate aerobic activity or 75 minutes of vigorous activity per week for overall health.',
      },
      {
        title: 'Posture & Core Strength',
        content: 'Focus on core strengthening exercises and maintain good posture. Strong core muscles support proper spinal alignment.',
      },
      {
        title: 'Flexibility & Stretching',
        content: 'Regular stretching, yoga, or Pilates can improve posture and help you stand taller by decompressing the spine.',
      },
      {
        title: 'Bone Health',
        content: 'Continue weight-bearing exercises like walking, jogging, or resistance training to maintain bone density.',
      },
    ],
  };

  return {
    diet: dietRecommendations[ageGroup],
    exercise: exerciseRecommendations[ageGroup],
  };
}
