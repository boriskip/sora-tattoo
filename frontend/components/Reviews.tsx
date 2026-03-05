'use client';

import { useTranslations, useLocale } from 'next-intl';
import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import { buttonTransitionClass } from '@/utils/animations';
import { getApiUrl } from '@/lib/api';
import type { Review } from '@/lib/api';

type ReviewsProps = { data?: Review[] };

export default function Reviews({ data }: ReviewsProps) {
  const tCommon = useTranslations('common');
  const tReviews = useTranslations('reviews');
  const locale = useLocale();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState<'success' | 'error' | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    rating: 5,
    message: ''
  });

  const reviews: Review[] = Array.isArray(data) ? data : (data ? Object.values(data) : []);

  function formatReviewDate(createdAt: string | undefined): string {
    if (!createdAt) return '';
    try {
      return new Date(createdAt).toLocaleDateString(locale, { dateStyle: 'medium' });
    } catch {
      return '';
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitMessage(null);
    try {
      const apiUrl = getApiUrl();
      const res = await fetch(`${apiUrl}/reviews?locale=${locale}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          author: formData.name,
          email: formData.email,
          text: formData.message,
          rating: formData.rating,
        }),
      });
      if (res.ok) {
        setSubmitMessage('success');
        setFormData({ name: '', email: '', rating: 5, message: '' });
        setIsFormOpen(false);
      } else {
        setSubmitMessage('error');
      }
    } catch {
      setSubmitMessage('error');
    } finally {
      setIsSubmitting(false);
    }
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
    <section id="reviews" className="py-12 md:py-32 bg-background overflow-x-hidden w-full">
      <div className="container mx-auto px-4 max-w-full">
        <div className="flex flex-col md:flex-row justify-between items-center mb-6 md:mb-12">
          <motion.h2
            className="font-serif font-normal text-[27px] leading-[36px] tracking-[0.2em] text-graphite mb-6 md:mb-0 text-center md:text-left"
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: false }}
            transition={{ duration: 0.6 }}
          >
            {tCommon('reviews')}
          </motion.h2>
          <motion.button
            type="button"
            onClick={() => setIsFormOpen(true)}
            className={`px-6 py-2 bg-graphite text-white rounded-xl hover:opacity-95 font-medium cursor-pointer shadow-sm ${buttonTransitionClass}`}
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: false }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            {tReviews('leaveReview')}
          </motion.button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {reviews.length === 0 ? (
            <p className="text-mocha col-span-full text-center py-8">
              No reviews yet. Be the first to leave one!
            </p>
          ) : (
          reviews.map((review, index) => (
            <motion.div
              key={review.id}
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1, duration: 0.6 }}
              className="bg-background p-6 rounded-lg shadow-md hover:shadow-xl transition-shadow"
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
              <p className="text-mocha mb-4 leading-relaxed">
                &quot;{review.text}&quot;
              </p>
              <div className="flex items-baseline justify-between gap-2">
                <p className="text-sm font-semibold text-graphite">
                  — {review.author}
                </p>
                {review.created_at && (
                  <p className="text-xs text-mocha/80 shrink-0">
                    {formatReviewDate(review.created_at)}
                  </p>
                )}
              </div>
            </motion.div>
          )))}
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
                initial={{ opacity: 0, scale: 0.98, y: 10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.98, y: 10 }}
                className="fixed inset-0 z-50 flex items-center justify-center p-4"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="bg-background rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                  <div className="p-6 md:p-8">
                    <div className="flex justify-between items-center mb-6">
                      <h3 className="font-serif font-normal text-[27px] leading-[36px] tracking-[0.2em] text-graphite">
                        {tReviews('leaveReview')}
                      </h3>
                      <button
                        type="button"
                        onClick={() => setIsFormOpen(false)}
                        className="text-mocha hover:text-graphite text-2xl"
                      >
                        ×
                      </button>
                    </div>

                    {submitMessage === 'success' && (
                      <p className="mb-4 text-green-600 font-medium">
                        Thank you! Your review will be published after moderation.
                      </p>
                    )}
                    {submitMessage === 'error' && (
                      <p className="mb-4 text-red-600 font-medium">
                        Something went wrong. Please try again.
                      </p>
                    )}
                    <form onSubmit={handleSubmit} className="space-y-6">
                      {/* Name */}
                      <div>
                        <label htmlFor="review-name" className="block text-sm font-medium text-mocha mb-2">
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

                      {/* Email */}
                      <div>
                        <label htmlFor="review-email" className="block text-sm font-medium text-mocha mb-2">
                          {tReviews('formEmail')}
                        </label>
                        <input
                          type="email"
                          id="review-email"
                          name="email"
                          value={formData.email}
                          onChange={handleChange}
                          required
                          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-900"
                        />
                      </div>

                      {/* Rating */}
                      <div>
                        <label className="block text-sm font-medium text-mocha mb-2">
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
                                  ? 'bg-yellow-400 text-graphite'
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
                        <label htmlFor="review-message" className="block text-sm font-medium text-mocha mb-2">
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
                          className={`px-6 py-1.5 bg-background/95 text-graphite rounded-xl hover:bg-white/90 font-medium border border-mocha/20 shadow-sm ${buttonTransitionClass}`}
                        >
                          {tReviews('formCancel')}
                        </button>
                        <button
                          type="submit"
                          disabled={isSubmitting}
                          className={`px-6 py-1.5 bg-graphite text-white rounded-xl hover:opacity-95 font-medium shadow-sm disabled:opacity-60 ${buttonTransitionClass}`}
                        >
                          {isSubmitting ? '…' : tReviews('formSubmit')}
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

