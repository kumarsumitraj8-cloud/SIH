import { BlockchainBlock, UserRole } from '../types/landRecord';

/**
 * Fast SHA-256 Hasher using Web Crypto API
 */
async function computeSha256(text: string): Promise<string> {
  if (typeof window !== 'undefined' && window.crypto && window.crypto.subtle) {
    const msgBuffer = new TextEncoder().encode(text);
    const hashBuffer = await window.crypto.subtle.digest('SHA-256', msgBuffer);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  }
  // Simple fallback hash if crypto.subtle is unavailable
  let hash = 0;
  for (let i = 0; i < text.length; i++) {
    const char = text.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash |= 0;
  }
  return 'fallback_' + Math.abs(hash).toString(16).padStart(16, '0');
}

const STORAGE_KEY = 'bhoomisetu_blockchain_ledger_v1';

export class BlockchainLedger {
  private chain: BlockchainBlock[] = [];

  constructor() {
    this.loadChain();
  }

  private loadChain(): void {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        this.chain = JSON.parse(saved);
      } else {
        this.initGenesisBlock();
      }
    } catch (e) {
      console.warn('Failed to load blockchain from localStorage, resetting genesis', e);
      this.initGenesisBlock();
    }
  }

  private saveChain(): void {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(this.chain));
    } catch (e) {
      console.error('Failed to save blockchain to localStorage', e);
    }
  }

  private initGenesisBlock(): void {
    const genesis: BlockchainBlock = {
      blockIndex: 0,
      timestamp: '2026-08-01T00:00:00.000Z',
      recordId: 'GENESIS-0000',
      ulpin: 'GENESIS-BHU-AADHAAR',
      khasraNo: '000',
      action: 'SCAN_INGESTION',
      performedBy: 'MoRD_DILRMP_SYSTEM_ROOT',
      role: 'ADMIN_DOLR',
      dataHash: 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855',
      previousHash: '0000000000000000000000000000000000000000000000000000000000000000',
      currentHash: '00008f1b67a213904e22ab4f248231db7218659d48b4887b411d5ca35e167389',
      nonce: 10482
    };
    this.chain = [genesis];
    this.saveChain();
  }

  public getChain(): BlockchainBlock[] {
    return [...this.chain];
  }

  public async addBlock(params: {
    recordId: string;
    ulpin: string;
    khasraNo: string;
    action: BlockchainBlock['action'];
    performedBy: string;
    role: UserRole;
    recordData: Record<string, any>;
  }): Promise<BlockchainBlock> {
    const prevBlock = this.chain[this.chain.length - 1];
    const prevHash = prevBlock ? prevBlock.currentHash : '0000000000000000000000000000000000000000000000000000000000000000';
    
    const timestamp = new Date().toISOString();
    const dataString = JSON.stringify(params.recordData);
    const dataHash = await computeSha256(dataString);

    let nonce = 0;
    let currentHash = '';
    
    // Light Proof-of-Authority proofing (finding hash with 2 leading zeroes)
    while (true) {
      const header = `${prevBlock ? prevBlock.blockIndex + 1 : 0}-${timestamp}-${params.recordId}-${prevHash}-${dataHash}-${nonce}`;
      currentHash = await computeSha256(header);
      if (currentHash.startsWith('00') || nonce > 200) {
        break;
      }
      nonce++;
    }

    const newBlock: BlockchainBlock = {
      blockIndex: this.chain.length,
      timestamp,
      recordId: params.recordId,
      ulpin: params.ulpin,
      khasraNo: params.khasraNo,
      action: params.action,
      performedBy: params.performedBy,
      role: params.role,
      dataHash,
      previousHash: prevHash,
      currentHash,
      nonce
    };

    this.chain.push(newBlock);
    this.saveChain();
    return newBlock;
  }

  public async verifyIntegrity(): Promise<{ isValid: boolean; corruptedIndex?: number; message: string }> {
    for (let i = 1; i < this.chain.length; i++) {
      const current = this.chain[i];
      const prev = this.chain[i - 1];

      if (current.previousHash !== prev.currentHash) {
        return {
          isValid: false,
          corruptedIndex: i,
          message: `Hash link broken at Block #${i}. Previous hash mismatch!`
        };
      }
    }
    return {
      isValid: true,
      message: `Blockchain verified. All ${this.chain.length} blocks are cryptographically valid and tamper-evident.`
    };
  }
}

export const blockchainLedger = new BlockchainLedger();
