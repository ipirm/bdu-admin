import { createVuetify } from 'vuetify';
import * as components from 'vuetify/components';
import * as directives from 'vuetify/directives';
import { aliases, mdi } from 'vuetify/iconsets/mdi';

export default createVuetify({
    components,
    directives,
    theme: {
        defaultTheme: 'dark',
        themes: {
            dark: {
                dark: true,
                colors: {
                    primary: '#1E88E5',
                    secondary: '#FFB300',
                    accent: '#8E24AA',
                    background: '#1C1C1E',
                    surface: '#2C2C2E',
                    error: '#FF5252',
                    info: '#29B6F6',
                    success: '#66BB6A',
                    warning: '#FFA726',
                },
            },
        },
    },
    icons: {
        defaultSet: 'mdi',
        aliases,
        sets: {
            mdi,
        },
    },
});
