import React from 'react';
import { AlertTriangle, Phone } from 'lucide-react';

export default function Footer() {
    return (
        <footer className="mt-auto border-t border-white/10 bg-surface/30 backdrop-blur-md">
            <div className="container mx-auto px-4 py-8">
                <div className="grid md:grid-cols-2 gap-8 mb-6">
                    {/* Disclaimer */}
                    <div>
                        <h3 className="text-sm font-bold text-primary mb-2 flex items-center gap-2">
                            <AlertTriangle className="w-4 h-4" strokeWidth={2} />
                            Важная информация
                        </h3>
                        <p className="text-xs text-text-secondary leading-relaxed">
                            Это приложение создано для личного использования и самопомощи.
                            Оно <strong>НЕ</strong> является заменой профессиональной медицинской или психологической помощи.
                            При серьезных проблемах с зависимостью обратитесь к специалисту.
                        </p>
                    </div>

                    {/* Crisis Resources */}
                    <div>
                        <h3 className="text-sm font-bold text-error mb-2 flex items-center gap-2">
                            <Phone className="w-4 h-4" strokeWidth={2} />
                            Нужна помощь сейчас?
                        </h3>
                        <div className="text-xs text-text-secondary space-y-1">
                            <p><strong>Телефон доверия (РФ):</strong> 8-800-2000-122 (бесплатно, круглосуточно)</p>
                            <p><strong>Скорая помощь:</strong> 103 или 112</p>
                            <p><strong>Анонимные Алкоголики:</strong> aa-russia.ru</p>
                            <p><strong>Нарко틀ики Анонимные:</strong> na-russia.org</p>
                        </div>
                    </div>
                </div>

                {/* Copyright */}
                <div className="text-center text-xs text-text-secondary pt-4 border-t border-white/5">
                    <p>© {new Date().getFullYear()} Мой КПТ • Сделано для личного использования</p>
                </div>
            </div>
        </footer>
    );
}
