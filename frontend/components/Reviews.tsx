'use client';

import { useTranslations } from 'next-intl';
import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';

export default function Reviews() {
  const tCommon = useTranslations('common');
  const tReviews = useTranslations('reviews');
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    rating: 5,
    message: ''
  });

  // Mock data - reviews
  const reviews = [
    {
      id: 1,
      author: 'Sarah M.',
      text: 'Absolut fantastische Erfahrung! Der Artist hat genau verstanden, was ich wollte, und das Ergebnis ist noch besser als erwartet.',
      rating: 5
    },
    {
      id: 2,
      author: 'Michael K.',
      text: 'Professionell, sauber und sehr talentiert. Das Studio ist wunderschön und die Atmosphäre ist entspannt.',
      rating: 5
    },
    {
      id: 3,
      author: 'Lisa T.',
      text: 'Mein erstes Tattoo und ich fühle mich so gut aufgehoben. Die Beratung war ausführlich und das Ergebnis ist perfekt.',
      rating: 5
    },
    {
      id: 4,
      author: 'David R.',
      text: 'Hervorragende Arbeit! Die Details sind unglaublich und die Heilung verlief problemlos.',
      rating: 5
    },
    {
      id: 5,
      author: 'Emma L.',
      text: 'Ich bin so glücklich mit meinem neuen Tattoo. Der Artist ist sehr geduldig und erklärt alles genau.',
      rating: 5
    },
    {
      id: 6,
      author: 'Tom H.',
      text: 'Top Qualität und Service! Kann ich nur weiterempfehlen. Werde definitiv wieder kommen.',
      rating: 5
    }
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Review submitted:', formData);
    // TODO: Connect to backend API
    setIsFormOpen(false);
    setFormData({ name: '', rating: 5, message: '' });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleRatingChange = (rating: number) => {
    setFormData({
      ...formData,
      rating
    });
  };

  return (
    <section id="reviews" className="py-12 md:py-32 bg-gray-50 overflow-x-hidden w-full">
      <div className="container mx-auto px-4 max-w-full">
        <div className="flex flex-col md:flex-row justify-between items-center mb-6 md:mb-12">
          <motion.h2
            className="text-4xl md:text-5xl font-serif font-bold text-gray-900 mb-6 md:mb-0 text-center md:text-left"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: false }}
            transition={{ duration: 0.6 }}
          >
            {tCommon('reviews')}
          </motion.h2>
          <motion.button
            type="button"
            onClick={() => setIsFormOpen(true)}
            className="px-6 py-3 bg-gray-900 text-white rounded-md hover:bg-gray-800 transition font-medium cursor-pointer"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: false }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            {tReviews('leaveReview')}
          </motion.button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {reviews.map((review, index) => (
            <motion.div
              key={review.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1, duration: 0.6 }}
              className="bg-white p-6 rounded-lg shadow-md"
            >
              <div className="flex items-center mb-4">
                {[...Array(review.rating)].map((_, i) => (
                  <svg
                    key={i}
                    className="w-5 h-5 text-yellow-400"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>
              <p className="text-gray-700 mb-4 leading-relaxed">
                "{review.text}"
              </p>
              <p className="text-sm font-semibold text-gray-900">
                — {review.author}
              </p>
            </motion.div>
          ))}
        </div>

        {/* Review Form Modal */}
        <AnimatePresence>
          {isFormOpen && (
            <>
              {/* Overlay */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setIsFormOpen(false)}
                className="fixed inset-0 bg-black/50 z-50"
              />
              
              {/* Form */}
              <motion.div
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: 20 }}
                className="fixed inset-0 z-50 flex items-center justify-center p-4"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                  <div className="p-6 md:p-8">
                    <div className="flex justify-between items-center mb-6">
                      <h3 className="text-2xl md:text-3xl font-serif font-bold text-gray-900">
                        {tReviews('leaveReview')}
                      </h3>
                      <button
                        type="button"
                        onClick={() => setIsFormOpen(false)}
                        className="text-gray-500 hover:text-gray-700 text-2xl"
                      >
                        ×
                      </button>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                      {/* Name */}
                      <div>
                        <label htmlFor="review-name" className="block text-sm font-medium text-gray-700 mb-2">
                          {tReviews('formName')}
                        </label>
                        <input
                          type="text"
                          id="review-name"
                          name="name"
                          value={formData.name}
                          onChange={handleChange}
                          required
                          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-900"
                        />
                      </div>

                      {/* Rating */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          {tReviews('formRating')}
                        </label>
                        <div className="flex gap-2">
                          {[1, 2, 3, 4, 5].map((rating) => (
                            <button
                              key={rating}
                              type="button"
                              onClick={() => handleRatingChange(rating)}
                              className={`w-10 h-10 rounded-full transition ${
                                formData.rating >= rating
                                  ? 'bg-yellow-400 text-gray-900'
                                  : 'bg-gray-200 text-gray-400 hover:bg-gray-300'
                              }`}
                            >
                              ★
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Message */}
                      <div>
                        <label htmlFor="review-message" className="block text-sm font-medium text-gray-700 mb-2">
                          {tReviews('formMessage')}
                        </label>
                        <textarea
                          id="review-message"
                          name="message"
                          value={formData.message}
                          onChange={handleChange}
                          required
                          rows={6}
                          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-900 resize-none"
                        />
                      </div>

                      {/* Buttons */}
                      <div className="flex gap-3 justify-end">
                        <button
                          type="button"
                          onClick={() => setIsFormOpen(false)}
                          className="px-6 py-2 bg-white text-gray-900 rounded-md hover:bg-gray-50 transition font-medium border border-gray-300"
                        >
                          {tReviews('formCancel')}
                        </button>
                        <button
                          type="submit"
                          className="px-6 py-2 bg-gray-900 text-white rounded-md hover:bg-gray-800 transition font-medium"
                        >
                          {tReviews('formSubmit')}
                        </button>
                      </div>
                    </form>
                  </div>
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}

