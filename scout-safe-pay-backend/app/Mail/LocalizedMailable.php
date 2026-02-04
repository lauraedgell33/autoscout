<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\App;

abstract class LocalizedMailable extends Mailable
{
    use Queueable, SerializesModels;

    /**
     * The user locale for this email.
     */
    protected string $userLocale = 'en';

    /**
     * Supported locales for emails.
     */
    protected static array $supportedLocales = ['en', 'de', 'ro', 'fr', 'es', 'it'];

    /**
     * Set the locale for this email.
     */
    public function setUserLocale(string $locale): self
    {
        $this->userLocale = in_array($locale, self::$supportedLocales) ? $locale : 'en';
        return $this;
    }

    /**
     * Get the user locale.
     */
    public function getUserLocale(): string
    {
        return $this->userLocale;
    }

    /**
     * Build the message - sets locale before rendering.
     */
    public function build()
    {
        // Set the application locale for this email
        $previousLocale = App::getLocale();
        App::setLocale($this->userLocale);

        // Let child class build the email
        $result = $this->buildContent();

        // Restore previous locale
        App::setLocale($previousLocale);

        return $result;
    }

    /**
     * Child classes should implement this to build their specific content.
     */
    abstract protected function buildContent();

    /**
     * Get the view data with locale included.
     */
    protected function getLocalizedViewData(array $data = []): array
    {
        return array_merge($data, [
            'locale' => $this->userLocale,
        ]);
    }

    /**
     * Helper to create localized email from user preferences.
     */
    public static function forUser($user): static
    {
        $instance = new static(...func_get_args());
        
        // Get user's preferred language
        $locale = $user->preferred_language ?? $user->locale ?? 'en';
        $instance->setUserLocale($locale);
        
        return $instance;
    }
}
