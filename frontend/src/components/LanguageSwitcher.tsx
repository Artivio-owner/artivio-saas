import i18n from 'i18next';

export default function LanguageSwitcher() {
  const change = (lng: string) => {
    i18n.changeLanguage(lng);
    localStorage.setItem('lang', lng);
  };

  return (
    <div>
      <button onClick={() => change('ru')}>RU</button>
      <button onClick={() => change('en')}>EN</button>
      <button onClick={() => change('de')}>DE</button>
    </div>
  );
}