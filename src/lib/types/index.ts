/**
 * Core type definitions for Nexus Portal
 */

// ============================================================================
// User Types
// ============================================================================

export interface User {
    id: string;
    username: string;
    displayName: string;
    avatar?: string;
    walletAddress: string;
    reputation: number;
    bio?: string;
    joinedAt: Date;
    verified: boolean;
}

export interface UserProfile extends User {
    followers: number;
    following: number;
    totalPosts: number;
    totalAgents: number;
}

// ============================================================================
// Agent Types
// ============================================================================

export type AgentType = 'trading' | 'analytics' | 'social' | 'content' | 'custom';
export type AgentStatus = 'active' | 'paused' | 'error' | 'deploying';

export interface AgentPerformance {
    roi: number; // Return on Investment percentage
    trades: number; // Total number of trades/actions
    uptime: number; // Uptime percentage
    successRate: number; // Success rate percentage
    lastActive: Date;
}

export interface Agent {
    id: string;
    name: string;
    description?: string;
    type: AgentType;
    status: AgentStatus;
    performance: AgentPerformance;
    owner: string; // User ID
    createdAt: Date;
    updatedAt: Date;
    avatar?: string;
    config?: Record<string, unknown>;
}

export interface AgentActivity {
    id: string;
    agentId: string;
    type: 'trade' | 'analysis' | 'post' | 'alert';
    title: string;
    description: string;
    result?: 'success' | 'failure' | 'pending';
    metadata?: Record<string, unknown>;
    timestamp: Date;
}

// ============================================================================
// Post/Feed Types
// ============================================================================

export type PostType = 'user' | 'agent' | 'system';
export type PostVisibility = 'public' | 'followers' | 'private';

export interface BasePost {
    id: string;
    type: PostType;
    content: string;
    timestamp: Date;
    likes: number;
    comments: number;
    shares: number;
    visibility: PostVisibility;
}

export interface UserPost extends BasePost {
    type: 'user';
    author: User;
    media?: MediaAttachment[];
    mentions?: string[]; // User IDs
    hashtags?: string[];
}

export interface AgentPost extends BasePost {
    type: 'agent';
    agent: Agent;
    activityId?: string; // Link to AgentActivity
    metrics?: {
        roi?: number;
        volume?: number;
        [key: string]: unknown;
    };
}

export interface SystemPost extends BasePost {
    type: 'system';
    severity: 'info' | 'warning' | 'critical';
    actionUrl?: string;
    actionLabel?: string;
    dismissible: boolean;
}

export type Post = UserPost | AgentPost | SystemPost;

export interface MediaAttachment {
    id: string;
    type: 'image' | 'video' | 'document';
    url: string;
    thumbnail?: string;
    alt?: string;
}

export interface Comment {
    id: string;
    postId: string;
    author: User;
    content: string;
    timestamp: Date;
    likes: number;
    replies?: Comment[];
}

// ============================================================================
// Service Status Types
// ============================================================================

export type ServiceName = 'openclaw' | 'livekit' | 'blockchain' | 'api';
export type ServiceStatus = 'operational' | 'degraded' | 'down' | 'maintenance';

export interface ServiceHealth {
    service: ServiceName;
    status: ServiceStatus;
    message?: string;
    lastChecked: Date;
    uptime?: number; // percentage
    responseTime?: number; // milliseconds
}

// ============================================================================
// Communication Types (OpenClaw)
// ============================================================================

export interface OpenClawRoom {
    id: string;
    name: string;
    topic?: string;
    avatar?: string;
    memberCount: number;
    unreadCount: number;
    lastMessage?: OpenClawMessage;
    encrypted: boolean;
    isDirect: boolean;
}

export interface OpenClawMessage {
    id: string;
    roomId: string;
    sender: User;
    content: string;
    timestamp: Date;
    edited?: boolean;
    reactions?: Record<string, string[]>; // emoji -> user IDs
    threadId?: string;
    attachments?: MediaAttachment[];
}

export interface TypingIndicator {
    roomId: string;
    users: User[];
}

// ============================================================================
// Live Session Types (LiveKit)
// ============================================================================

export type ParticipantRole = 'host' | 'speaker' | 'attendee';

export interface LiveSession {
    id: string;
    name: string;
    description?: string;
    host: User;
    startTime: Date;
    endTime?: Date;
    maxParticipants: number;
    currentParticipants: number;
    isRecording: boolean;
    isLive: boolean;
}

export interface Participant {
    id: string;
    user: User;
    role: ParticipantRole;
    isMuted: boolean;
    isCameraOn: boolean;
    isScreenSharing: boolean;
    joinedAt: Date;
    audioLevel?: number;
}

// ============================================================================
// Marketplace Types
// ============================================================================

export interface AgentListing {
    id: string;
    agent: Agent;
    price: number; // per hour/day/month
    pricingModel: 'hourly' | 'daily' | 'monthly' | 'one-time';
    rating: number;
    totalRentals: number;
    reviews: Review[];
    tags: string[];
}

export interface Review {
    id: string;
    author: User;
    rating: number;
    comment: string;
    timestamp: Date;
    helpful: number;
}

// ============================================================================
// Notification Types
// ============================================================================

export type NotificationType =
    | 'like'
    | 'comment'
    | 'follow'
    | 'mention'
    | 'agent_alert'
    | 'system';

export interface Notification {
    id: string;
    type: NotificationType;
    title: string;
    message: string;
    timestamp: Date;
    read: boolean;
    actionUrl?: string;
    actor?: User; // Who triggered the notification
    metadata?: Record<string, unknown>;
}

// ============================================================================
// API Response Types
// ============================================================================

export interface ApiResponse<T> {
    success: boolean;
    data?: T;
    error?: {
        code: string;
        message: string;
        details?: unknown;
    };
    meta?: {
        page?: number;
        pageSize?: number;
        total?: number;
        hasMore?: boolean;
    };
}

export interface PaginatedResponse<T> {
    items: T[];
    page: number;
    pageSize: number;
    total: number;
    hasMore: boolean;
}

// ============================================================================
// Form/Input Types
// ============================================================================

export interface CreateAgentInput {
    name: string;
    description?: string;
    type: AgentType;
    config?: Record<string, unknown>;
}

export interface CreatePostInput {
    content: string;
    visibility: PostVisibility;
    media?: File[];
    mentions?: string[];
    hashtags?: string[];
}

export interface UpdateProfileInput {
    displayName?: string;
    bio?: string;
    avatar?: File;
}

// ============================================================================
// Store State Types
// ============================================================================

export interface UserState {
    currentUser: User | null;
    isAuthenticated: boolean;
    isLoading: boolean;
    error: string | null;
}

export interface AgentsState {
    agents: Agent[];
    selectedAgent: Agent | null;
    isLoading: boolean;
    error: string | null;
    filters: {
        status?: AgentStatus;
        type?: AgentType;
    };
}

export interface FeedState {
    posts: Post[];
    isLoading: boolean;
    hasMore: boolean;
    error: string | null;
    page: number;
}

export interface NotificationsState {
    notifications: Notification[];
    unreadCount: number;
    isLoading: boolean;
}
