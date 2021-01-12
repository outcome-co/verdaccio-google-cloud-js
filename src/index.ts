/* istanbul ignore file */

import DataStorage from 'verdaccio-google-cloud'
import { getServiceUnavailable, getInternalError, getNotFound } from '@verdaccio/commons-api'
import { Token, TokenFilter } from '@verdaccio/types'
import { IStorageHelper } from 'verdaccio-google-cloud/lib/storage-helper'

class GoogleCloudDatabase extends DataStorage {
    /**
     * Save a token.
     *
     * @param token - The token.
     * @returns - The promise.
     */
    saveToken(token: Token): Promise<void> {
        const key = this.storage.datastore.key(['Token', token.key])
        const entity = {
            key,
            data: token
        }
        this.logger.debug('gcloud: [datastore saveToken] saved')
        this.logger.trace({ token }, 'gcloud: [datastore saveToken] saved @{token}')

        // Double casting to avoid compiler errors
        return <Promise<void>>(<Promise<unknown>>this.storage.datastore.upsert(entity))
    }

    get storage(): IStorageHelper {
        // @ts-expect-error, Override private member access
        return <IStorageHelper>this.helper
    }

    /**
     * Delete a token.
     *
     * @param user - The username.
     * @param tokenKey - The token key.
     * @returns The operation promise.
     */
    deleteToken(user: string, tokenKey: string): Promise<void> {
        this.logger.debug({ user, tokenKey }, 'gcloud: [datastore deleteToken] @{user} @{tokenKey}')

        const query = this.storage.datastore.createQuery('Token').filter('user', '=', user).filter('key', '=', tokenKey)
        return <Promise<void>>(<Promise<unknown>>this.storage.datastore
            .runQuery(query)
            .then(response => {
                this.logger.trace({ response }, 'gcloud: [datastore deleteToken] response @{response}')

                const tokens = <Token[]>response[0]

                if (!tokens) {
                    return Promise.reject(getNotFound('[deleteToken] unknown token'))
                }

                return Promise.all(
                    tokens.map(token => {
                        const key = this.storage.datastore.key(['Token', token.key])
                        return this.storage.datastore.delete(key)
                    })
                )
            })
            .catch((e: Error) => {
                const error = getInternalError(e.message)

                this.logger.warn({ error }, 'gcloud: [datastore deleteToken] error @{error}')
                return Promise.reject(getServiceUnavailable('[deleteToken] error'))
            }))
    }

    /**
     * Retrieve a list of tokens.
     *
     * @param filter - The filter.
     * @returns A Promise of an array of tokens.
     */
    readTokens(filter: TokenFilter): Promise<Token[]> {
        this.logger.debug({ filter }, 'gcloud: [datastore readTokens] @{filter}')

        const query = this.storage.datastore.createQuery('Token').filter('user', '=', filter.user)
        return this.storage.datastore
            .runQuery(query)
            .then(response => {
                this.logger.trace({ response }, 'gcloud: [datastore readTokens] response @{response}')

                const tokens = <Token[]>response[0]

                if (!tokens) {
                    return []
                }

                return tokens.map(token => {
                    return {
                        cidr: token.cidr,
                        key: token.key,
                        created: token.created,
                        token: token.token,
                        readonly: token.readonly,
                        user: token.user
                    }
                })
            })
            .catch((e: Error) => {
                const error = getInternalError(e.message)

                this.logger.warn({ error }, 'gcloud: [datastore readTokens] error @{error}')
                return Promise.reject(getServiceUnavailable('[readTokens] error'))
            })
    }
}

export { GoogleCloudDatabase as DataStorage }
export default GoogleCloudDatabase
