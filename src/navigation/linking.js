export default {
  prefixes: ['real.app://', 'https://real.app/', 'https://real.app/apps/social/', 'https://*.cloudfront.net/'],
  config: {
    screens: {
      App: {
        screens: {
          Root: {
            screens: {
              Home: {
                screens: {
                  Search: {
                    screens: {
                      CoinPosts: 'coin/:paymentTicker',
                    },
                  },
                  Profile: {
                    screens: {
                      ProfilePhoto: 'user/:userId/settings/photo',
                      InviteFriends: 'user/:userId/settings/contacts',
                    },
                  },
                },
              },
              Comments: 'user/:userId/post/:postId/comments',
              PostMedia: 'user/:userId/post/:postId',
              Profile: 'user/:userId',
            },
          },
        },
        Chat: {
          screens: {
            ChatDirect: 'chat/:chatId',
            Chat: 'chat',
          },
        },
      },
      Auth: {
        screens: {
          AuthUsername: 'signup/:userId',
          AuthEmailConfirm: 'confirm/email/:userId/:confirmationCode',
          AuthForgotConfirm: 'confirm/forgot/:userId/:confirmationCode',
        },
      },
    },
  },
}
