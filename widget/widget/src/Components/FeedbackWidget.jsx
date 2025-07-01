import React, { useState } from 'react'
import html2canvas from 'html2canvas'
import axios from 'axios'
import './FeedbackWidget.css'

const FeedbackWidget = () => {
  const [isOpen, setIsOpen] = useState(false)
  const [note, setNote] = useState('')
  const [tag, setTag] = useState('UI-Bug')
  const [screenshot, setScreenshot] = useState(null)
  const [loading, setLoading] = useState(false)

  const toggleWidget = () => setIsOpen(!isOpen)

  const captureScreenshot = async () => {
    const canvas = await html2canvas(document.body)
    const imgData = canvas.toDataURL('image/jpeg', 0.7)
    setScreenshot(imgData)
  }

  const handleSubmit = async () => {
    if (!note) return alert('Please enter a note')
    setLoading(true)

    const metadata = {
      url: window.location.href,
      userAgent: navigator.userAgent,
      custom: window.FEEDBACK_META || {},
    }

    const formData = new FormData()
    formData.append('note', note)
    formData.append('tag', tag)
    formData.append('metadata', JSON.stringify(metadata))
    if (screenshot) {
      const blob = await (await fetch(screenshot)).blob()
      formData.append('screenshot', blob, 'screenshot.jpg')
    }

    try {
      await axios.post('http://localhost:3001/feedback', formData)
      alert('Feedback submitted!')
      setNote('')
      setScreenshot(null)
      setIsOpen(false)
    } catch (error) {
      console.error(error)
      alert('Submission failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      {isOpen && (
        <div className="feedback-modal">
          <h3>Submit Feedback</h3>
          <select value={tag} onChange={(e) => setTag(e.target.value)}>
            <option>UI-Bug</option>
            <option>Content</option>
            <option>Idea</option>
            <option>Other</option>
          </select>
          <textarea
            maxLength={140}
            placeholder="Describe the issue..."
            value={note}
            onChange={(e) => setNote(e.target.value)}
          />


          {/* Capture Screenshot button */}
          <button onClick={captureScreenshot}>📸 Capture Screenshot</button>
          {screenshot && <img src={screenshot} alt="preview" className="preview-img" />}
          
          {/* Submitt feedback button  */}
          <button onClick={handleSubmit} disabled={loading}>
            {loading ? 'Submitting...' : 'Submit Feedback'}
          </button>

          {/* Cancel button  */}
          <button onClick={toggleWidget}>Cancel</button>
        </div>
      )}

      <button className="feedback-button" onClick={toggleWidget}>
        💬
      </button>
    </>
  )
}

export default FeedbackWidget
