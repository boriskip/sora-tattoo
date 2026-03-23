'use client';

import { useTranslations, useLocale } from 'next-intl';
import { useSearchParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import { buttonTransitionClass } from '@/utils/animations';
import { getApiUrl } from '@/lib/api';
import type { ContactSettings, HeroSettings } from '@/lib/api';

type ContactProps = {
  contact?: ContactSettings | null;
  hero?: HeroSettings | null;
};

export default function Contact({ contact, hero }: ContactProps) {
  const searchParams = useSearchParams();
  const locale = useLocale();
  const tCommon = useTranslations('common');
  const tContact = useTranslations('contact');
  const tArtists = useTranslations('artists');
  const [formData, setFormData] = useState({
    name: '',
    contact: '',
    bodyPart: '',
    style: '',
    artist: '',
    preferredDate: '',
    message: ''
  });
  const [honeypot, setHoneypot] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState<'success' | 'error' | null>(null);

  useEffect(() => {
    const artist = searchParams.get('artist') || '';
    if (artist) setFormData((prev) => ({ ...prev, artist }));
  }, [searchParams]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (honeypot) return;
    setIsSubmitting(true);
    setSubmitMessage(null);
    try {
      const apiUrl = getApiUrl();
      const res = await fetch(`${apiUrl}/contact-inquiry`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.name.trim(),
          contact: formData.contact.trim(),
          body_part: formData.bodyPart.trim() || null,
          style: formData.style.trim() || null,
          artist: formData.artist.trim() || null,
          preferred_date: formData.preferredDate || null,
          message: formData.message.trim() || null,
          locale,
          website: honeypot,
        }),
      });
      if (res.ok) {
        setSubmitMessage('success');
        const artistFromUrl = searchParams.get('artist') || '';
        setFormData({
          name: '',
          contact: '',
          bodyPart: '',
          style: '',
          artist: artistFromUrl,
          preferredDate: '',
          message: '',
        });
        setHoneypot('');
      } else {
        setSubmitMessage('error');
      }
    } catch {
      setSubmitMessage('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <section id="contact" className="py-12 md:py-32 bg-background overflow-x-hidden w-full">
      <div className="container mx-auto px-4 max-w-full">
        <motion.h2
          className="font-serif font-normal text-[27px] leading-[36px] tracking-[0.2em] text-graphite mb-12 md:mb-16 text-center"
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          {tCommon('contact')}
        </motion.h2>

        <div className="max-w-4xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Contact Info */}
          <motion.div
            initial={{ opacity: 0, x: -12 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h3 className="font-serif font-normal text-[27px] leading-[36px] tracking-[0.2em] text-graphite mb-6">
              {tContact('studioInfo')}
            </h3>
            <div className="space-y-4 text-mocha">
              {contact?.address?.trim() && (
                <p>
                  <strong>{tContact('address')}:</strong><br />
                  {contact.address}
                </p>
              )}
              {contact?.working_hours?.trim() && (
                <p>
                  <strong>{tContact('hours')}:</strong><br />
                  {contact.working_hours}
                </p>
              )}
              {contact?.phone?.trim() && (
                <p>
                  <strong>{tContact('phone')}:</strong>{' '}
                  <a href={`tel:${contact.phone.replace(/\s/g, '')}`} className="hover:text-graphite transition">
                    {contact.phone}
                  </a>
                </p>
              )}
              {contact?.email?.trim() && (
                <p>
                  <strong>{tContact('email')}:</strong>{' '}
                  <a href={`mailto:${contact.email}`} className="hover:text-graphite transition">
                    {contact.email}
                  </a>
                </p>
              )}
              {(!contact?.address?.trim() && !contact?.working_hours?.trim() && !contact?.phone?.trim() && !contact?.email?.trim()) && (
                <p className="text-mocha/70">{tContact('noContactInfo')}</p>
              )}
              <div className="flex gap-4 mt-6">
                {hero?.instagram_url && (
                  <a
                    href={hero.instagram_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-mocha hover:text-graphite transition"
                    aria-label="Instagram"
                  >
                    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                    </svg>
                  </a>
                )}
                {hero?.facebook_url && (
                  <a
                    href={hero.facebook_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-mocha hover:text-graphite transition"
                    aria-label="Facebook"
                  >
                    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                    </svg>
                  </a>
                )}
                {hero?.whatsapp_url && (
                  <a
                    href={hero.whatsapp_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-mocha hover:text-graphite transition"
                    aria-label="WhatsApp"
                  >
                    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
                    </svg>
                  </a>
                )}
              </div>
            </div>
          </motion.div>

          {/* Booking Form */}
          <motion.div
            initial={{ opacity: 0, x: 12 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: false, amount: 0.3 }}
            transition={{ duration: 0.6 }}
          >
          <form
            onSubmit={handleSubmit}
            className="space-y-4"
          >
            <div className="sr-only" aria-hidden="true">
              <label htmlFor="contact-form-website">Leave blank</label>
              <input
                type="text"
                id="contact-form-website"
                name="website"
                tabIndex={-1}
                autoComplete="off"
                value={honeypot}
                onChange={(e) => setHoneypot(e.target.value)}
              />
            </div>
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-mocha mb-1">
                {tContact('formName')} *
              </label>
              <input
                type="text"
                id="name"
                name="name"
                required
                value={formData.name}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-gray-900 focus:border-transparent"
              />
            </div>

            <div>
              <label htmlFor="contact" className="block text-sm font-medium text-mocha mb-1">
                {tContact('formContact')} *
              </label>
              <input
                type="text"
                id="contact"
                name="contact"
                required
                value={formData.contact}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-gray-900 focus:border-transparent"
              />
            </div>

            <div>
              <label htmlFor="bodyPart" className="block text-sm font-medium text-mocha mb-1">
                {tContact('formBodyPart')}
              </label>
              <input
                type="text"
                id="bodyPart"
                name="bodyPart"
                value={formData.bodyPart}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-gray-900 focus:border-transparent"
              />
            </div>

            {formData.artist && (
              <div>
                <span className="block text-sm font-medium text-mocha mb-1">
                  {tContact('formArtist')}
                </span>
                <p className="text-graphite font-medium">
                  {formData.artist === 'artist-01'
                    ? tArtists('artist1.name')
                    : formData.artist === 'artist-02'
                      ? tArtists('artist2.name')
                      : formData.artist === 'artist-03'
                        ? tArtists('artist3.name')
                        : formData.artist}
                </p>
                <input type="hidden" name="artist" value={formData.artist} />
              </div>
            )}

            <div>
              <label htmlFor="style" className="block text-sm font-medium text-mocha mb-1">
                {tContact('formStyle')}
              </label>
              <select
                id="style"
                name="style"
                value={formData.style}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-gray-900 focus:border-transparent"
              >
                <option value="">{tContact('formStylePlaceholder')}</option>
                <option value="japanese">Japanese</option>
                <option value="realism">Realism</option>
                <option value="minimal">Minimal</option>
                <option value="graphic">Graphic</option>
              </select>
            </div>

            <div>
              <label htmlFor="preferredDate" className="block text-sm font-medium text-mocha mb-1">
                {tContact('formDate')}
              </label>
              <input
                type="date"
                id="preferredDate"
                name="preferredDate"
                value={formData.preferredDate}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-gray-900 focus:border-transparent"
              />
            </div>

            <div>
              <label htmlFor="message" className="block text-sm font-medium text-mocha mb-1">
                {tContact('formMessage')}
              </label>
              <textarea
                id="message"
                name="message"
                rows={4}
                value={formData.message}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-gray-900 focus:border-transparent"
              />
            </div>

            {submitMessage === 'success' && (
              <p className="text-sm text-green-800 bg-green-50 border border-green-200 rounded-md px-3 py-2">
                {tContact('formSubmitSuccess')}
              </p>
            )}
            {submitMessage === 'error' && (
              <p className="text-sm text-red-800 bg-red-50 border border-red-200 rounded-md px-3 py-2">
                {tContact('formSubmitError')}
              </p>
            )}

            <button
              type="submit"
              disabled={isSubmitting}
              className={`w-full px-6 py-2 bg-graphite text-white rounded-xl hover:opacity-95 font-medium shadow-sm disabled:opacity-60 ${buttonTransitionClass}`}
            >
              {isSubmitting ? tContact('formSubmitting') : tCommon('book')}
            </button>
          </form>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

