/* istanbul ignore file */

import DataStorage from 'verdaccio-google-cloud'
import { getServiceUnavailable, getInternalError, getNotFound } from '@verdaccio/commons-api'

/**
 * @typedef {import('@verdaccio/types').Token} Token
 * @typedef {import('@verdaccio/types').TokenFilter} TokenFilter
 */

class GoogleCloudDatabase extends DataStorage {
    /**
     * Save a token.
     *
     * @param {Token} token - The token.
     * @returns {Promise} - The promise.
     */
    saveToken (token) {
        // @ts-ignore
        const key = this.helper.datastore.key(['Token', token.key])
        const entity = {
            key,
            data: token
        }
        this.logger.debug('gcloud: [datastore saveToken] saved')
        this.logger.trace({ token }, 'gcloud: [datastore saveToken] saved @{token}')

        // @ts-ignore
        return this.helper.datastore.upsert(entity)
    }

    /**
     * Delete a token.
     *
     * @param {string} user - The username.
     * @param {string} tokenKey - The token key.
     * @returns {Promise} - The operation promise.
     */
    deleteToken (user, tokenKey) {
        this.logger.debug({ user, tokenKey }, 'gcloud: [datastore deleteToken] @{user} @{tokenKey}')

        // @ts-ignore
        const query = this.helper.datastore.createQuery('Token').filter('user', '=', user).filter('key', '=', tokenKey)

        // @ts-ignore
        return this.helper.datastore.runQuery(query).then((response) => {
            this.logger.trace({ response }, 'gcloud: [datastore deleteToken] response @{response}')

            /** @type {Array<Token>} */
            const tokens = response[0]

            if (!tokens) {
                return Promise.reject(getNotFound('[deleteToken] unknown token'))
            }

            return Promise.all(tokens.map((token) => {
                // @ts-ignore
                const key = this.helper.datastore.key(['Token', token.key])
                // @ts-ignore
                return this.helper.datastore.delete(key)
            }))
        }).catch((e) => {
            const error = getInternalError(e.message)

            this.logger.warn({ error }, 'gcloud: [datastore deleteToken] error @{error}')
            return Promise.reject(getServiceUnavailable('[deleteToken] error'))
        })
    }

    /**
     * Retrieve a list of tokens.
     *
     * @param {TokenFilter} filter - The filter.
     * @returns {Promise<Array<Token>>} - A Promise of an array of tokens.
     */
    readTokens (filter) {
        this.logger.debug({ filter }, 'gcloud: [datastore readTokens] @{filter}')
        // @ts-ignore
        const query = this.helper.datastore.createQuery('Token').filter('user', '=', filter.user)
        // @ts-ignore
        return this.helper.datastore.runQuery(query).then((response) => {
            this.logger.trace({ response }, 'gcloud: [datastore readTokens] response @{response}')

            /** @type {Array<Token>} */
            const tokens = response[0]

            if (!tokens) {
                return []
            }

            return tokens.map((token) => {
                return {
                    cidr: token.cidr,
                    key: token.key,
                    created: token.created,
                    token: token.token,
                    readonly: token.readonly,
                    user: token.user
                }
            })
        }).catch((e) => {
            const error = getInternalError(e.message)

            this.logger.warn({ error }, 'gcloud: [datastore readTokens] error @{error}')
            return Promise.reject(getServiceUnavailable('[readTokens] error'))
        })
    }
}

export { GoogleCloudDatabase as DataStorage }
export default GoogleCloudDatabase
