export class SecurityFactory {

	private static ensureSubtle(): SubtleCrypto {
		const subtle = globalThis.crypto?.subtle;
		if(!subtle) throw new Error('Web Crypto SubtleCrypto unavailable in this environment');
		return subtle;
	};

	private static ensureCrypto(): Crypto {
		const c = globalThis.crypto;
		if(!c) throw new Error('Web Crypto unavailable in this environment');
		return c;
	};

	private static toHex(bytes: Uint8Array): string {
		return Array.from(bytes).map((b) => b.toString(16).padStart(2, '0')).join('');
	};

	private static fromHex(hex: string): Uint8Array {
		if(hex.length % 2 !== 0) throw new Error('Hex string length must be even');
		const out = new Uint8Array(hex.length / 2);
		for (let i = 0; i < out.length; i++) out[i] = parseInt(hex.substr(i * 2, 2), 16);
		return out;
	};

	private static timingSafeEqualHex(aHex: string, bHex: string): boolean {
		if(aHex.length !== bHex.length) return false;
		let diff = 0;
		for(let i = 0; i < aHex.length; i++) {
			diff |= aHex.charCodeAt(i) ^ bHex.charCodeAt(i);
		};
		return diff === 0;
	};

	static async hmacSha256(data: string, secret: string): Promise<string> {
		const subtle = this.ensureSubtle();
		const enc = new TextEncoder();
		const key = await subtle.importKey(
			'raw',
			enc.encode(secret).buffer,
			{ name: 'HMAC', hash: 'SHA-256' },
			false,
			['sign']
		);
		const signature = await subtle.sign('HMAC', key, enc.encode(data).buffer);
		return this.toHex(new Uint8Array(signature));
	};

	static async verifyHmacSha256(data: string, secret: string, expectedDigestHex: string): Promise<boolean> {
		const computed = await this.hmacSha256(data, secret);
		return this.timingSafeEqualHex(computed, expectedDigestHex);
	};

	static async deriveAesGcmKeyFromSecret(
		secret: string,
		saltHex?: string,
		iterations = 100_000
	): Promise<{ key: CryptoKey; saltHex: string }> {
		const subtle = this.ensureSubtle();
		const enc = new TextEncoder();
		const salt: Uint8Array = saltHex ? this.fromHex(saltHex) : this.ensureCrypto().getRandomValues(new Uint8Array(16));
		const baseKey = await subtle.importKey('raw', enc.encode(secret).buffer, 'PBKDF2', false, ['deriveKey']);
		const key = await subtle.deriveKey(
			{ name: 'PBKDF2', salt: salt.buffer as ArrayBuffer, iterations, hash: 'SHA-256' },
			baseKey,
			{ name: 'AES-GCM', length: 256 },
			false,
			['encrypt', 'decrypt']
		);
		return { key, saltHex: this.toHex(salt) };
	};

	static async encryptAesGcm(
		plaintext: string,
		key: CryptoKey,
		ivHex?: string,
		tagLength = 128
	): Promise<{ ivHex: string; ctHex: string; tagHex: string }> {
		const subtle = this.ensureSubtle();
		const enc = new TextEncoder();
		const iv: Uint8Array = ivHex ? this.fromHex(ivHex) : this.ensureCrypto().getRandomValues(new Uint8Array(12));
		const ctWithTagBuf = await subtle.encrypt(
			{ name: 'AES-GCM', iv: iv.buffer as ArrayBuffer, tagLength },
			key,
			enc.encode(plaintext).buffer
		);
		const ctWithTag = new Uint8Array(ctWithTagBuf);
		const tagBytes = ctWithTag.slice(ctWithTag.length - tagLength / 8);
		const ctBytes = ctWithTag.slice(0, ctWithTag.length - tagBytes.length);
		return { ivHex: this.toHex(iv), ctHex: this.toHex(ctBytes), tagHex: this.toHex(tagBytes) };
	};

	static async decryptAesGcm(
		encObj: { ivHex: string; ctHex: string; tagHex: string },
		key: CryptoKey,
		tagLength = 128
	): Promise<string | null> {
		try {
			const subtle = this.ensureSubtle();
			const iv = this.fromHex(encObj.ivHex);
			const ct = this.fromHex(encObj.ctHex);
			const tag = this.fromHex(encObj.tagHex);
			const ctWithTag = new Uint8Array(ct.length + tag.length);
			ctWithTag.set(ct, 0);
			ctWithTag.set(tag, ct.length);
			const plaintextBuf = await subtle.decrypt(
				{ name: 'AES-GCM', iv: iv.buffer as ArrayBuffer, tagLength },
				key,
				ctWithTag.buffer as ArrayBuffer
			);
			return new TextDecoder().decode(plaintextBuf);
		} catch {
			return null;
		};
	};
  
};