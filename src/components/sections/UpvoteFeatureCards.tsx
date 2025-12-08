import FadeInWhenVisible from '@/components/shared/FadeInWhenVisible';

const UpvoteFeatureCards = () => {
  const features = [
    {
      title: 'Community Voice',
      description:
        'Your upvote helps highlight issues that need immediate attention from local authorities.',
      icon: '👥',
    },
    {
      title: 'Priority Boost',
      description:
        'Issues with more upvotes get higher visibility and faster response times.',
      icon: '📈',
    },
    {
      title: 'Collective Impact',
      description:
        'Join your neighbors in advocating for better infrastructure and community improvements.',
      icon: '🤝',
    },
  ];

  return (
    <FadeInWhenVisible delay={0.2}>
      <div className='grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3'>
        {features.map((feature, index) => (
          <div
            key={index}
            className='group rounded-2xl bg-white/90 p-6 shadow-xl backdrop-blur-sm transition-all duration-300 hover:scale-105 hover:bg-white hover:shadow-2xl'
          >
            <div className='mb-4 text-4xl'>{feature.icon}</div>
            <h4 className='mb-2 text-lg font-semibold text-gray-900'>
              {feature.title}
            </h4>
            <p className='text-sm leading-relaxed text-gray-600'>
              {feature.description}
            </p>
          </div>
        ))}
      </div>
    </FadeInWhenVisible>
  );
};

export default UpvoteFeatureCards;
