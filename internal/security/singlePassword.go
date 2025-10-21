package security

import (
	"crypto/rand"
	"encoding/base64"
	"encoding/hex"
	"errors"
	"os"
	"sync"
	"time"
)

const TokenDuration = time.Hour

type Token struct {
	ID       string `json:"id"`
	Value    string `json:"value"`
	ExpireAt int64  `json:"expire_at"`
}

func newToken(duration time.Duration) *Token {
	randomBytes := make([]byte, 16)
	rand.Read(randomBytes)

	return &Token{
		ID:       hex.EncodeToString(randomBytes),
		Value:    base64.StdEncoding.EncodeToString(randomBytes),
		ExpireAt: time.Now().Add(duration).Unix(),
	}
}

type SinglePasswordAuth struct {
	password      string
	tokens        []*Token
	tokenDuration time.Duration
	mu            sync.RWMutex
}

func NewSinglePasswordAuth() (*SinglePasswordAuth, error) {
	password := os.Getenv("PASSWORD")
	if password == "" {
		return nil, errors.New("PASSWORD is required")
	}
	s := &SinglePasswordAuth{
		password:      password,
		tokens:        make([]*Token, 0),
		tokenDuration: TokenDuration,
	}
	return s, nil
}

func (s *SinglePasswordAuth) Login(password string) (string, error) {
	if password != s.password {
		return "", errors.New("invalid password")
	}
	return s.generateToken(), nil
}

func (s *SinglePasswordAuth) VerifyToken(value string) error {
	s.mu.RLock()
	defer s.mu.RUnlock()

	for _, t := range s.tokens {
		if t.Value == value {
			return nil
		}
	}
	return errors.New("token is not valid: " + value)
}

func (s *SinglePasswordAuth) generateToken() string {
	token := newToken(s.tokenDuration)

	s.mu.Lock()
	s.tokens = append(s.tokens, token)
	s.mu.Unlock()

	go s.revokeToken(token.ID)
	return token.Value
}

func (s *SinglePasswordAuth) revokeToken(id string) {
	time.Sleep(s.tokenDuration)
	s.mu.Lock()
	defer s.mu.Unlock()

	for i, t := range s.tokens {
		if t.ID == id {
			s.tokens = append(s.tokens[:i], s.tokens[i+1:]...)
			break
		}
	}
}
